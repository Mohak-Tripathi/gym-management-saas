/*
  Warnings:

  - You are about to drop the column `paymentMode` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `gymId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `paymentMethod` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "paymentMode",
ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMode" NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
