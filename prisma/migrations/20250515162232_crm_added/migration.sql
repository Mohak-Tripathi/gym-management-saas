-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'LOST');

-- CreateTable
CREATE TABLE "CRMLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "contactNumber" TEXT NOT NULL,
    "whatsappNumber" TEXT,
    "probabilityOfConversion" INTEGER NOT NULL,
    "leadSource" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "followUpDate" TIMESTAMP(3),
    "notes" TEXT,
    "conversionDate" TIMESTAMP(3),
    "expectedMembershipId" TEXT,
    "gymId" TEXT NOT NULL,
    "gymBranchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CRMLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CRMLead_gymId_idx" ON "CRMLead"("gymId");

-- CreateIndex
CREATE INDEX "CRMLead_gymBranchId_idx" ON "CRMLead"("gymBranchId");

-- CreateIndex
CREATE INDEX "CRMLead_status_idx" ON "CRMLead"("status");

-- AddForeignKey
ALTER TABLE "CRMLead" ADD CONSTRAINT "CRMLead_expectedMembershipId_fkey" FOREIGN KEY ("expectedMembershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMLead" ADD CONSTRAINT "CRMLead_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMLead" ADD CONSTRAINT "CRMLead_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
