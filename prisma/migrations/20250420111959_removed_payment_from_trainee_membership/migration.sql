/*
  Warnings:

  - You are about to drop the column `traineeMembershipId` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_traineeMembershipId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "traineeMembershipId";
