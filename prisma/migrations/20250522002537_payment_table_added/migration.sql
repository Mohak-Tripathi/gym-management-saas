/*
  Warnings:

  - The values [SUCCESS] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `amountPaid` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmountDue` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `traineeMembershipId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentMethod" ADD VALUE 'CHEQUE';
ALTER TYPE "PaymentMethod" ADD VALUE 'WALLET';
ALTER TYPE "PaymentMethod" ADD VALUE 'OTHER';

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
ADD COLUMN     "amountPaid" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "nextPaymentDate" TIMESTAMP(3),
ADD COLUMN     "totalAmountDue" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "traineeMembershipId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Payment_gymBranchId_idx" ON "Payment"("gymBranchId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_traineeMembershipId_fkey" FOREIGN KEY ("traineeMembershipId") REFERENCES "TraineeMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
