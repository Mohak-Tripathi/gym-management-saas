/*
  Warnings:

  - You are about to drop the column `membershipType` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `traineeId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `amountPaid` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `nextPaymentDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmountDue` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `traineeId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `traineeMembershipId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Trainee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_traineeId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_traineeId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_traineeMembershipId_fkey";

-- DropIndex
DROP INDEX "Invoice_traineeId_idx";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "membershipType",
DROP COLUMN "traineeId",
ADD COLUMN     "nextPaymentDate" TIMESTAMP(3),
ADD COLUMN     "taxAmount" DOUBLE PRECISION,
ADD COLUMN     "taxType" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amountPaid",
DROP COLUMN "nextPaymentDate",
DROP COLUMN "status",
DROP COLUMN "totalAmountDue",
DROP COLUMN "traineeId",
DROP COLUMN "traineeMembershipId";

-- AlterTable
ALTER TABLE "Trainee" DROP COLUMN "age",
ALTER COLUMN "healthIssues" DROP NOT NULL,
ALTER COLUMN "healthIssues" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aadharNumber" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "clientRepresentative" TEXT;

-- CreateIndex
CREATE INDEX "Invoice_membershipId_idx" ON "Invoice"("membershipId");
