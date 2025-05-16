/*
  Warnings:

  - You are about to drop the column `probabilityOfConversion` on the `CRMLead` table. All the data in the column will be lost.
  - Added the required column `probabilityPercent` to the `CRMLead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CRMLead" DROP COLUMN "probabilityOfConversion",
ADD COLUMN     "probabilityPercent" INTEGER NOT NULL;
