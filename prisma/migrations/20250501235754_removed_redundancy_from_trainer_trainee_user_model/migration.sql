/*
  Warnings:

  - You are about to drop the column `email` on the `Trainee` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Trainee` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Trainee` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Trainer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Trainer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Trainee_email_key";

-- AlterTable
ALTER TABLE "Trainee" DROP COLUMN "email",
DROP COLUMN "fullName",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "Trainer" DROP COLUMN "fullName",
DROP COLUMN "phone";
