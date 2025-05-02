/*
  Warnings:

  - You are about to drop the column `email` on the `Trainer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Trainer_email_key";

-- AlterTable
ALTER TABLE "Trainer" DROP COLUMN "email";
