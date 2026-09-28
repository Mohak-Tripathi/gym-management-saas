# README_INTERVIEW — tenancy & rate-limiting prep

Everything here comes from code I read at HEAD (`f91fd62`, last code commit 2025-06-11). Line numbers are for the files as they are on disk now.

> **Read first:** `README.md` makes several tenancy claims that the code contradicts (flagged inline as **README ≠ CODE**). If the interviewer read the README, expect to be asked about them.

---

## 1. TENANCY MODEL

**Shape:** one shared Postgres schema. Every row carries a `gymId` column (tenant), and most rows also carry a `gymBranchId` column (branch). There is no schema-per-tenant, no DB-per-tenant and no RLS (no `POLICY`/`ROW LEVEL` in any migration).

**Fields per model** (`prisma/schema.prisma`)

| Model | `gymId` | `gymBranchId` | Indexes on tenant fields |
|---|---|---|---|
| Trainee, Trainer, CRMLead, Equipment, Payment, ProductCategory, Product, Cart, Order | required | required | `gymId` + `gymBranchId` |
| CommunityPost, Notification | required | required | composite `(gymId, gymBranchId)` |
| TraineeMembership, WorkoutPlan, TrainerSalary | required | required | `gymId` only |
| Attendance | required | required | `gymBranchId` only (**no `gymId` index**) |
| Membership, MaintenanceSchedule, MaintenanceLog, SmartDevice, PasswordSetupToken | required | required | **none** |
| Invoice | required | required | **none on tenant fields** (only `membershipId`, `status`) |
| **User** | required | **nullable** | both |
| **Complaint, Feedback** | required | **nullable** | both |
| GymBranch | required | — | `gymId` |
| StaffBranch | required | `branchId` required | each column |
| Certification, CommunityPostImage, ProductImage, CartItem, OrderItem | **none** | **none** | scoped only through their parent FK |

- **Globally unique columns, which hit every tenant:** `Gym.name`, `User.email`, `User.phone`, `Equipment.serialNumber`, `Product.sku`, `Invoice.receiptNumber`, `Order.orderNumber`. So one phone number can't belong to members of two different gyms.
- **README ≠ CODE:** `README.md:87` says "Every model carries both `gymId` and `gymBranchId` as non-nullable foreign keys with database indexes." That's false for User, Complaint and Feedback (nullable branch), for the five child tables (no tenant fields) and for the unindexed models above.

**Where the tenant ID comes from**

- **`gymId` comes from the signed JWT.** It's written into the token at login from the database row, and the client can't choose it.
  ```ts
  // src/database/user.database.ts:314-323 (login)
  const payload = { userId: user.id, role: user.role, gymId: user.gymId,
                    gymBranchId: user.gymBranchId ?? null };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  ```
  ```ts
  // src/utils/authMiddleware.ts:33-35
  const decoded = jwt.verify(token, secret) as JwtPayload;
  req.user = decoded;
  ```
- **`gymBranchId` comes from client input**: `req.query.gymBranchId`, or the request body on create/onboard.
  - The JWT does carry `gymBranchId`, but **no controller reads it**. The only consumer is `attendance.service.ts:37`, and that reads the DB user row, not the token.
  - Onboarding takes it from the body: `trainee.controller.ts:21-39`, `trainer.controller.ts:22-30`.

**Exact resolve-then-apply path** (the same pattern appears in every controller):
```ts
// src/controllers/trainee.controller.ts:57-64
const { gymId } = req.user!;                              // token
const gymBranchId = req.query.gymBranchId as string;      // client input
const trainees = await TraineeService.getAllTrainees(gymId, gymBranchId);
```
```ts
// src/database/trainee.database.ts:82
where: { gymId, gymBranchId },
```
- Scoping is applied **by hand in each `src/database/*.ts` method**. There's no Prisma middleware/extension, no `AsyncLocalStorage` and no shared helper.
- **If `gymBranchId` is omitted, the filter widens to the whole gym.** Prisma drops `undefined` keys:
  - `trainee.database.ts:82`, `traineemembership.database.ts:29` and `productCategory.database.ts` pass it straight through.
  - `feedback.database.ts:72` and `complaint.database.ts:72` make it explicitly optional: `...(branchId && { gymBranchId })`.
  - `user.database`, `membership.database`, `trainer.database`, `crmLead.database` and `equipment.database` reject a missing value instead.
- **README ≠ CODE:** `README.md:87` says "Auth middleware extracts both from the JWT payload and injects them into every query." The middleware only decodes the token. Branch comes from the client, and nothing is injected.

---

## 2. THE CROSS-BRANCH CASE

- **A junction table exists but is dead code.** `StaffBranch` (`schema.prisma:640-659`, migration `20250501120456_staff_branch_for_validation_created`):
  ```prisma
  model StaffBranch {
    id String @id; userId String; branchId String; gymId String; role UserRole
    @@unique([userId, branchId, role])
    @@index([userId]) @@index([branchId]) @@index([gymId]) @@index([role])
  }
  ```
- **Where it's checked: nowhere.** `grep -ri staffBranch src/` returns zero hits. Nothing reads it and nothing writes it.
- **What actually happens:** any authenticated user with the right role can pass any `?gymBranchId=` belonging to their gym and get that branch's data. The `gymId` filter still blocks other tenants, so within a gym, branch isolation doesn't exist.
- **The branch isn't checked against the gym either.** On create, a body `gymBranchId` from *another* gym only has to satisfy the FK, which produces rows where `gymId = A` and the branch belongs to gym B.
- **README ≠ CODE:** `README.md:87-89` says "A staff member assigned to Branch A cannot access Branch B data" and "The `StaffBranch` junction table handles multi-branch staff assignments." Neither is implemented.

---

## 3. ROLES

- **Definition:** `enum UserRole { SUPERADMIN ADMIN RECEPTIONIST TRAINER TRAINEE }` at `schema.prisma:225-231`, stored on `User.role` and `StaffBranch.role`.
  - An unused `enum AdminRole { OWNER MANAGER }` sits at `schema.prisma:606-609`.
- **SUPERADMIN is per gym, not platform-wide.** The seed script creates it with a `gymId` and no branch (`src/scripts/createSuperAdminAndGym.ts:168-176`).
- **Enforcement layer: Express route middleware only.**
  ```ts
  // src/utils/authMiddleware.ts:47-55
  export const authorize = (...allowedRoles: UserRole[]) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) { res.status(403)...; return }
    next();
  };
  ```
  - A duplicate check inside the controller exists only in `gymBranch.controller.ts:10, 100, 140`.
  - Services check role only as input validation during onboarding (`userData.role !== "TRAINEE"`).
  - The database enforces nothing.
- **Role comes from the 7-day JWT.** There's no revocation, so a demoted or deleted user keeps their role until the token expires.
- **Which routes use which roles:**
  - **SUPERADMIN + ADMIN:** trainees, trainers, memberships, trainee-memberships, community-post, maintenance-schedule, auth user CRUD, gym-branch get/put.
  - **SUPERADMIN only:** gym-branch create, delete and list.
  - **Authenticated but no `authorize()`, so any role including TRAINEE:** complaint, crm-lead, gym-equipments, feedback, attendance, payment, invoice, `auth/:id/change-password`.
  - **No auth at all:** `/api/gym/*`, `/api/qr`, `/api/auth/login`, `/api/password/reset`.
- **RECEPTIONIST and TRAINER appear in no `authorize()` call.** They can only reach the routes that have no role check.
- **`role` can be set by the client (mass assignment):**
  - Create: `user.controller.ts:36` passes `{ ...req.body, gymId }`, and `user.database.ts:153` spreads it into `prisma.user.create`. An ADMIN can create a SUPERADMIN.
  - Update: `user.service.ts:81` spreads `req.body` in the same way.

---

## 4. THE BYPASS QUESTION

**Tenant-isolation breaks (cross-gym)**
- **`/api/gym/*`: no auth middleware at all** (`gym.routes.ts:6-10`). Anyone can list every gym with its branches, rename or delete any gym (`gym.database.ts`, `where: { id }`), or create gyms.
- **Payment creates cross-tenant writes.** `payment.service.ts:210`: `tx.traineeMembership.findUnique({ where: { id: traineeMembershipId } })` has no `gymId` check.
  - Any authenticated user (no role check, `payment.route.ts:12`) can overwrite another gym's `discountedPrice`/`discountPercentage` and mint an invoice stamped with the caller's `gymId`.
  - `gymBranchId` comes from the query string (`payment.controller.ts:43`).
- **Trainer update is a cross-tenant write, and it moves the trainer between tenants.**
  - `trainer.database.ts:289` only checks that `gymId`/`gymBranchId` are *present*.
  - `:300-303` looks up the trainer by `{ id }` alone and never compares tenants.
  - `:337` and `:344` then update the user and trainer rows with data that `trainer.controller.ts:182-183` has overwritten with the **caller's** `gymId`/`gymBranchId`.
- **Biometric punch is cross-tenant.**
  - `attendance.controller.ts:78` takes `userId` from the body.
  - `user.database.ts:94` looks the user up by id only.
  - Any logged-in user can record attendance and fire the gate stub for any user in any gym.
- **The QR token can be used as a login token (read, not tested).**
  - `GET /api/qr` has no auth (`qr.routes.ts:6`) and signs `{deviceId, type}` with `JWT_SECRET || 'your-secret-key'` (`jwt.ts:9`).
  - When the real secret is in the env at import time (Docker `env_file`), `authMiddleware` accepts that token.
  - `req.user.gymId` is then `undefined`. `invoice.controller.ts:34` doesn't check for that, so `where: { id, gymId: undefined }` drops the tenant filter and returns any invoice by id, with customer PII and a presigned PDF URL.
- **IDs taken from the body aren't tenant-checked:** `membershipId` (onboarding), `equipmentId` (maintenance schedule create), `expectedMembershipId` (CRM lead), `trainerId`, `userId` (feedback/complaint update). The FK check is the only check.

**Branch-isolation breaks (same gym)**
- Every branch-scoped endpoint takes `gymBranchId` from the client (section 1), and StaffBranch is never consulted (section 2).
- The invoice PDF is filtered by `gymId` only and has no role check, so a TRAINEE can fetch other members' invoices in the same gym.

**Other paths outside the scoping mechanism**
- **Raw SQL:** none. No `$queryRaw`/`$executeRaw` in `src/`. Migrations contain DDL only.
- **Seeds:** `src/scripts/createSuperAdminAndGym.ts` uses its own `PrismaClient`, takes CLI args and runs via `make create-superadmin-ts`. It creates a gym plus a SUPERADMIN with no branch.
- **Background jobs / cron / queues:** NOT FOUND IN CODE. BullMQ appears only as an idea in `ToDo.md:17-21`.
- **Webhooks:** NOT FOUND IN CODE. The biometric endpoint is an ordinary JWT-protected route.
- **Platform admin endpoints:** NOT FOUND IN CODE. The only cross-tenant surface is the unauthenticated `/api/gym`.
- **File uploads:**
  - Every upload goes through the API: `multer.memoryStorage()` with a 50 MB limit, although the comment says 5 MB (`upload.middleware.ts:5`).
  - It's used on trainee, trainer, user, equipment and community-post routes.
  - S3 keys have **no tenant prefix** (`'user-profile-images'`, `'Muscletech-equipment-images'`, `'muscletech-community-post-images'`, `'invoices'`) in one shared bucket.
  - No MIME or extension validation.
  - **README ≠ CODE:** `README.md:140` says "Backend never receives binary data."
- **Password reset:** `/api/password/reset` looks up `PasswordSetupToken` globally by token. **Nothing ever writes a `PasswordSetupToken`**, so the route is effectively dead. Onboarding emails a plaintext password instead (`emailService.ts`).
- **Change password:** `/api/auth/:id/change-password` takes the target from the URL, not the token. It still requires the current password (`user.database.ts:412` onward).
- **Login:** a global `findUnique({ email })` (`user.database.ts:284`). That's correct, since email is globally unique.

---

## 5. WHAT I'D FLAG IN REVIEW

1. **Tenancy depends on each developer remembering the filter.**
   - Scoping is repeated by hand in about 17 database files. The two places it was forgotten (payment `:210`, trainer update `:300`) are both **cross-tenant writes**.
   - Nothing catches the next one: no Prisma extension, no RLS, no tests.
   - `LeftOverWork.md:189-190` shows RLS was consciously deferred.
2. **Branch scope comes from client input.**
   - `?gymBranchId=` is trusted as sent. The token's `gymBranchId` is ignored and StaffBranch is dead code.
   - An omitted param silently widens to the whole gym on the trainee, trainee-membership, product-category, feedback and complaint lists.
3. **Auth gaps:**
   - `/api/gym` has no auth.
   - `role` is mass-assignable on user create/update.
   - `authorize()` is missing on 7 route files.
   - Biometric `userId` comes from the body.
   - The JWT secret has a hardcoded fallback, `'your-secret-key'` (`jwt.ts:9`), and QR tokens share the auth secret.
4. **What breaks at 100 gyms:**
   - **Rate limiter** (`rateLimiter.ts`): 100 requests per 15 minutes **per IP**, using the default **in-memory** store.
     - It's applied *before* auth (`app.ts:76`), so it can't know the tenant.
     - `trust proxy` isn't set, so behind a proxy every client shares one bucket.
     - A front desk behind one NAT exhausts it for the whole branch.
     - Nothing is shared across instances, and there's no per-tenant or per-login limit.
   - **Receipt numbers:**
     - `payment.service.ts:157` hardcodes `branchCode = "001"`.
     - `:163` queries the last invoice **across all gyms**.
     - That read-then-write against a globally `@unique` column means every tenant shares one sequence, and concurrent payments collide.
   - A separate `new PrismaClient()` in nearly every database/service file means one connection pool per file.
   - No pagination anywhere. Every list call also presigns S3 URLs item by item (`trainee.database.ts`, `user.database.ts`).
   - Global unique `email`/`phone` blocks a person from joining a second gym.
5. **Error handling and hardcoding:**
   - **HEAD doesn't build:** `productCategory.routes.ts:3` imports a missing `../middlewares/auth.middleware`, and `tsc --noEmit` fails.
   - `handleErrorResponse.ts:29-32` returns `err.stack` to clients.
   - `user.database.ts` `getById` wraps its own 404 in a catch that rethrows 500.
   - Four controllers `throw` *outside* `try` (`complaint`, `feedback`, `crmLead`, `communityPost` `create`).
   - The welcome email is sent before the user row is created (`user.database.ts:148`).
   - `gymPhone: '9090909099'` is hardcoded on invoices (`invoice.service.ts:196`).
   - CORS origins are hardcoded (`app.ts:49-52`).
   - `src/middlewares/errors.middleware.ts` is empty.

**Other README claims the code doesn't back:**
- Puppeteer only appears in comments (`pdfGenerator.ts:2`).
- "enforced at middleware" (`README.md:132`): see section 1.

---

## 6. THE BIOMETRIC WORK

- **eSSL / ZKTeco / device SDK / ADMS (`iclock`) push endpoint / sync job / polling / device config:** NOTHING FOUND.
- **What does exist:**
  - `POST /api/attendance/punch/biometric` (`attendence.route.ts:18`) → `attendance.controller.ts:75-94`.
    - It's a generic JSON endpoint: `{ userId, method, deviceId }` in the body, behind the normal user-JWT auth.
    - Nothing in it is device-specific.
  - `attendance.service.ts:14-56` sets `DENIED` if a TRAINEE has no unexpired membership, otherwise `SUCCESS`, and writes an `Attendance` row.
    - `deviceId` is **not** passed to the insert (`:34-40`), so `Attendance.deviceId` is never populated.
    - `Attendance.rawData` is never written.
  - `src/utils/sonoffGate.ts` is a stub: `console.log` plus the comment "integrate real Sonoff HTTP/ESP API here later."
  - Schema only:
    - `enum AttendanceMethod { BIOMETRIC QR_SCAN }`
    - `model SmartDevice { type DeviceType(BIOMETRIC|QR_SMART_LOCK), ipAddress, gymId, gymBranchId }`, which no code reads or writes
    - Migration `20250531150429_attendence_schema`
  - Git history: `c657b88` "attendance logic for QR and biometric is done" (2025-06-01).
  - Prose only: `README.md:230-232` gives the biometric integration's cost as the reason the project was discontinued.
- **Bottom line:** you built a device-agnostic punch endpoint, a QR flow and schema placeholders. You did **not** write any eSSL integration code.

---

## Likely interviewer questions on tenancy

**Q1. Why a shared schema with a `gymId` column instead of a schema or database per tenant?**
A shared Postgres schema with `gymId` on almost every model (`schema.prisma`) kept Prisma migrations to one path and suited a pilot with one gym chain. The honest trade-off is that isolation is a convention: every `src/database/*.ts` method repeats `where: { gymId, ... }` by hand, with no RLS backstop, and `LeftOverWork.md` shows RLS was deferred on purpose.

**Q2. Where does the tenant ID come from? Can the client spoof it?**
`gymId` can't be spoofed. It's signed into the JWT at login from the DB row (`user.database.ts:314-323`) and read from `req.user` in every controller. `gymBranchId` *can* be spoofed within a gym: it's read from `req.query`/`req.body`, and the JWT copy is never used. Tenant isolation holds against that; branch isolation doesn't.

**Q3. How do you stop a new endpoint from forgetting the filter?**
In this codebase nothing does, and there are two concrete misses: `payment.service.ts:210` and `trainer.database.ts:300` look records up by `id` alone. The fix I'd propose:
- A Prisma client extension that injects `gymId` from request context (`AsyncLocalStorage`) into every query
- Postgres RLS keyed on a session variable as a backstop
- A cross-tenant integration test per resource

**Q4. How do staff who work at more than one branch get access?**
The design is `StaffBranch(userId, branchId, gymId, role)` with `@@unique([userId, branchId, role])`, but it was never wired in: zero reads or writes in `src/`. Today any ADMIN can pass any branch ID in their gym. To finish it, I'd resolve the allowed branch IDs from StaffBranch at login or per request, then reject any `gymBranchId` outside that set in middleware, before the controller runs.

**Q5. Is rate limiting tenant-aware?**
No. `rateLimiter.ts` uses `express-rate-limit` with its in-memory default at 100 requests per 15 minutes per IP, mounted before auth (`app.ts:76`), and `trust proxy` isn't configured. That makes it neither per-tenant nor safe across instances. I'd move it after auth, key it on `gymId` (plus IP for `/login`) and back it with Redis so limits hold across instances and one noisy gym can't starve others.
