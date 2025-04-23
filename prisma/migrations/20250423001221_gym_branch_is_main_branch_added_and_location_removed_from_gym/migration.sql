/*
  Warnings:

  - You are about to drop the column `location` on the `Gym` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gym" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "GymBranch" ADD COLUMN     "isMainBranch" BOOLEAN NOT NULL DEFAULT false;
