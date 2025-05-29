/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `CommunityPost` table. All the data in the column will be lost.
  - You are about to drop the column `visibleTo` on the `CommunityPost` table. All the data in the column will be lost.
  - Added the required column `invoiceId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'CARD', 'UPI', 'NET_BANKING', 'CHEQUE', 'OTHER');

-- AlterTable
ALTER TABLE "CommunityPost" DROP COLUMN "imageUrls",
DROP COLUMN "visibleTo",
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "invoiceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CommunityPostImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "communityPostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityPostImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "gymBranchId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "membershipType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueAmount" DOUBLE PRECISION NOT NULL,
    "paymentMode" "PaymentMode",
    "amountInWords" TEXT NOT NULL,
    "terms" TEXT,
    "pdfUrl" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_receiptNumber_key" ON "Invoice"("receiptNumber");

-- CreateIndex
CREATE INDEX "Invoice_traineeId_idx" ON "Invoice"("traineeId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPostImage" ADD CONSTRAINT "CommunityPostImage_communityPostId_fkey" FOREIGN KEY ("communityPostId") REFERENCES "CommunityPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "TraineeMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
