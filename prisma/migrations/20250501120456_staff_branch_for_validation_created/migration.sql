-- CreateTable
CREATE TABLE "StaffBranch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffBranch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffBranch_userId_idx" ON "StaffBranch"("userId");

-- CreateIndex
CREATE INDEX "StaffBranch_branchId_idx" ON "StaffBranch"("branchId");

-- CreateIndex
CREATE INDEX "StaffBranch_gymId_idx" ON "StaffBranch"("gymId");

-- CreateIndex
CREATE INDEX "StaffBranch_role_idx" ON "StaffBranch"("role");

-- CreateIndex
CREATE UNIQUE INDEX "StaffBranch_userId_branchId_role_key" ON "StaffBranch"("userId", "branchId", "role");

-- AddForeignKey
ALTER TABLE "StaffBranch" ADD CONSTRAINT "StaffBranch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffBranch" ADD CONSTRAINT "StaffBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffBranch" ADD CONSTRAINT "StaffBranch_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
