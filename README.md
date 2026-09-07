# LiftUP — Gym Management SaaS

Production-grade multi-tenant SaaS for gym chains. Manages members, trainers, billing, equipment, CRM leads, attendance, and an in-app product store — all scoped across tenants and branches.

![LiftUP Login](./screenshots/login.png)

---

**Live Demo:** [gym-management-saas-frontend-lcle.vercel.app](https://gym-management-saas-frontend-lcle.vercel.app)  
**Frontend:** [gym-management-saas-frontend](https://github.com/Mohak-Tripathi/gym-management-saas-frontend)

---

## What it does

LiftUP is built to run multiple gym chains on one platform. Each chain (tenant) can have multiple branches. Every record — members, trainers, memberships, invoices, equipment — is scoped at both the tenant level (`gymId`) and the branch level (`gymBranchId`). No cross-tenant or cross-branch data leakage.

**Module overview:**

| Module | What it covers |
|--------|---------------|
| Member Management | Onboarding, fitness profiling, workout plans, attendance |
| Trainer Management | Profiles, certifications, salary tracking, assignments |
| Membership & Billing | Tiers, discounts, invoices, PDF receipts, payment tracking |
| CRM | Lead pipeline with status tracking and membership conversion |
| Equipment | Inventory, maintenance schedules, maintenance logs |
| Community Feed | Posts, images, categories, pinned announcements |
| Notifications | Role-targeted, entity-linked notification system |
| Smart Devices | Biometric + QR smart lock device management |
| Product Store | Categories, products, cart, orders, order tracking |
| Complaints & Feedback | Member-facing complaint resolution workflow |

---

## Architecture

```mermaid
graph TB
    subgraph Client
        FE[Next.js Frontend<br/>Vercel]
    end

    subgraph API["Express 5 + Node.js 18 + TypeScript"]
        RL[Rate Limiter]
        AUTH[JWT Auth<br/>+ Tenant + Branch Resolver]
        CTRL[Controllers / Services]
        PDF[Invoice PDF Engine<br/>PDFKit + Puppeteer]
        EMAIL[Email Service<br/>Resend + EJS Templates]
        S3SVC[S3 Service<br/>Presigned URL Generator]
    end

    subgraph Data
        PG[(PostgreSQL 15<br/>Prisma ORM<br/>30+ models)]
        S3[(AWS S3<br/>Files, Images, PDFs)]
    end

    subgraph Infra
        DOCKER[Multi-stage Docker<br/>node:18-alpine]
        AWS[AWS EC2 + API Gateway]
    end

    FE -->|HTTPS REST| RL
    RL --> AUTH
    AUTH -->|gymId + gymBranchId scoped| CTRL
    CTRL --> PG
    CTRL --> PDF
    CTRL --> EMAIL
    CTRL --> S3SVC
    S3SVC -->|presigned URLs| S3
    PDF -->|upload PDF| S3
    DOCKER --> AWS
```

---

## Two-Level Tenant Scoping

Most multi-tenant SaaS systems scope by one key. LiftUP scopes by two:

```
Gym (tenant)
  └── GymBranch (branch)
        └── All data: Trainee, Trainer, Membership, Invoice,
            Equipment, Attendance, CRMLead, Product...
```

Every model carries both `gymId` and `gymBranchId` as non-nullable foreign keys with database indexes. Auth middleware extracts both from the JWT payload and injects them into every query. A staff member assigned to Branch A cannot access Branch B data even within the same gym chain.

The `StaffBranch` junction table handles multi-branch staff assignments — a trainer can work across branches without getting cross-branch data access.

---

## Data Model

```
Gym                    — Tenant root. All relations cascade from here.
GymBranch              — Branch within a gym chain.
User                   — All roles: SUPERADMIN / ADMIN / RECEPTIONIST / TRAINER / TRAINEE
Trainee                — Member profile: fitness goals, BMI, body fat, training
                         experience, activity level, workout frequency, health issues
Trainer                — Trainer profile: specializations, certifications, work type
Certification          — Trainer certifications with document upload
Membership             — Tier definition: price, discounted price, duration, benefits
TraineeMembership      — Assigned membership: discount %, reason, extra months
Invoice                — Full invoice: receipt number, amount in words, PDF URL,
                         tax, installment support, payment status lifecycle
Payment                — Payment records linked to Invoice (supports partial payments)
WorkoutPlan            — Trainer-assigned plans with exercises
TrainerSalary          — Salary: MONTHLY / ONE_TIME / CONTRACT
CRMLead                — Lead pipeline: source, status, follow-up date,
                         expected membership, conversion tracking
Equipment              — Inventory with status (WORKING / NEEDS_SERVICE / OUT_OF_ORDER)
MaintenanceSchedule    — Scheduled maintenance: DAILY / WEEKLY / MONTHLY / QUARTERLY
MaintenanceLog         — Execution log with photo upload and performer tracking
CommunityPost          — Feed: images, categories (ANNOUNCEMENT / EVENT / CHALLENGE etc),
                         pinned posts
Notification           — Role-targeted, linked to any entity type
Attendance             — QR_SCAN / BIOMETRIC check-in with device tracking
SmartDevice            — Device registry for biometric readers and QR smart locks
Product / Category     — Product catalog: SKU, stock, discounts, images
Cart / CartItem        — Per-user cart (one cart per user)
Order / OrderItem      — Order lifecycle: PENDING → CONFIRMED → SHIPPED → DELIVERED
Complaint / Feedback   — Resolution workflow with admin response
```

---

## Key Engineering Decisions

**Two-level scoping over single-level**

Single `gymId` scoping would give branch managers access to all branches within the chain. Adding `gymBranchId` as a mandatory second scope key — indexed and enforced at middleware — gives branch-level isolation without separate schemas or databases.

**Multi-stage Docker build**

Builder stage: installs all deps, compiles TypeScript, generates Prisma client. Production stage: starts clean, copies only `dist/` and prod deps. No TypeScript compiler or dev tooling in the production image.

**S3 presigned URLs for all file uploads**

Backend never receives binary data. Returns a short-lived presigned URL. Client uploads directly to S3. Applies to: member photos, trainer certifications, equipment images, community post images, invoice PDFs, maintenance photos.

**PDF split across PDFKit and Puppeteer**

PDFKit for structured invoice layouts — fast, no browser overhead. Puppeteer for HTML/CSS-based documents (membership cards, formatted reports). Generated PDFs upload to S3, URL stored in Invoice record.

**Invoice as first-class model**

Invoice carries: receipt number, `amountInWords` (via `number-to-words`), tax type, tax amount, installment support via `nextPaymentDate`, PDF URL, and full payment status lifecycle (PENDING → PARTIALLY_PAID → PAID). Payments are separate records linked to Invoice — supports partial payment tracking.

**Prisma migrations at container startup**

`CMD: npx prisma migrate deploy && node dist/app.js` — safe in production since `migrate deploy` only applies pending migrations, never rolls back.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18 + TypeScript 5 |
| Framework | Express 5 |
| ORM | Prisma 6 + PostgreSQL 15 |
| Auth | JWT + bcrypt |
| File Storage | AWS S3 + presigned URLs |
| PDF | PDFKit + Puppeteer |
| Email | Resend + EJS templates |
| Rate Limiting | express-rate-limit |
| Containerization | Docker multi-stage (node:18-alpine) |
| Deployment | AWS EC2 + API Gateway |

---

## Local Setup

**With Docker (recommended):**
```bash
git clone https://github.com/Mohak-Tripathi/gym-management-saas
cd gym-management-saas

cp .env.example .env
# Fill: JWT_SECRET, AWS credentials, RESEND_API_KEY

docker compose up --build
# API:           http://localhost:4000
# Prisma Studio: http://localhost:5555
```

**Without Docker:**
```bash
npm install
npx prisma migrate dev
npm run dev
```

**Frontend:**
```bash
git clone https://github.com/Mohak-Tripathi/gym-management-saas-frontend
cd gym-management-saas-frontend
npm install
# Set NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/gym_db
PORT=4000
JWT_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

RESEND_API_KEY=
```

---

## Numbers

- Ran a one-month pilot with a 2-branch gym chain, 800+ members
- 30+ Prisma models · 20+ enums across 10 functional modules
- Two-level tenant scoping: Gym + GymBranch
- Multi-stage Docker build — production image ~60% smaller than single-stage

**Status:** discontinued after the pilot on unit economics — the biometric
attendance integration cost more per year than single-customer revenue,
and follow-up conversations with other gym owners showed no broader market.
Kept public as an engineering reference.

Built by [Mohak Tripathi](https://linkedin.com/in/mohak-tripathi)

