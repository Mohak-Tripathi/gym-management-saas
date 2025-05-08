-- AlterTable
ALTER TABLE "GymBranch" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "membershipDiscountedPrice" DECIMAL(65,30) NOT NULL DEFAULT 0;
