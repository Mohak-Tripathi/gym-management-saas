/*
  Warnings:

  - You are about to drop the column `image` on the `Trainee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "imageName" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "mimeType" TEXT;

-- AlterTable
ALTER TABLE "Trainee" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageName" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "mimeType" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
