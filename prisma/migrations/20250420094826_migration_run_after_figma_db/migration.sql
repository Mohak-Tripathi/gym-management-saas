/*
  Warnings:

  - You are about to drop the column `duration` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfJoining` on the `Trainee` table. All the data in the column will be lost.
  - You are about to drop the column `membershipId` on the `Trainee` table. All the data in the column will be lost.
  - The `specialization` column on the `Trainer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkoutPlan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TraineeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('MONTHLY', 'ONE_TIME', 'CONTRACT');

-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PAID', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('FULL_TIME', 'PART_TIME', 'FREELANCER', 'OTHER');

-- CreateEnum
CREATE TYPE "TrainerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('ANNOUNCEMENT', 'TRANSFORMATION', 'EVENT', 'TRAINER_UPDATE', 'GENERAL', 'FITNESS_TIP', 'CHALLENGE', 'GYM_TIMING_CHANGE');

-- CreateEnum
CREATE TYPE "UserGroup" AS ENUM ('ALL', 'TRAINEE', 'TRAINER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_MEMBER', 'PAYMENT_RECEIVED', 'COMMUNITY_POST', 'MEMBERSHIP_EXPIRING', 'TRAINER_ASSIGNED', 'NEW_TRAINER', 'TRAINEE_PROGRESS', 'MEMBERSHIP_RENEWAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "RelatedEntity" AS ENUM ('TRAINEE', 'TRAINER', 'PAYMENT', 'COMMUNITY_POST', 'MEMBERSHIP');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'BANK_TRANSFER';

-- DropForeignKey
ALTER TABLE "Trainee" DROP CONSTRAINT "Trainee_membershipId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutPlan" DROP CONSTRAINT "WorkoutPlan_trainerId_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "duration",
DROP COLUMN "price",
ADD COLUMN     "actualPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "baseDuration" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "traineeMembershipId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Trainee" DROP COLUMN "dateOfJoining",
DROP COLUMN "membershipId",
ADD COLUMN     "healthIssues" TEXT[],
ADD COLUMN     "image" TEXT,
ADD COLUMN     "personalizedGoal" TEXT[],
ADD COLUMN     "referenceMobileNo" TEXT,
ADD COLUMN     "status" "TraineeStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE',
ADD COLUMN     "joiningDate" TIMESTAMP(3),
ADD COLUMN     "lastLoggedIn" TIMESTAMP(3),
ADD COLUMN     "referenceMobileNo" TEXT,
ADD COLUMN     "status" "TrainerStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "workType" "WorkType" NOT NULL DEFAULT 'FULL_TIME',
DROP COLUMN "specialization",
ADD COLUMN     "specialization" TEXT[];

-- AlterTable
ALTER TABLE "WorkoutPlan" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "trainerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institute" TEXT,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "documentUrl" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraineeMembership" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "discountedPrice" DECIMAL(65,30) NOT NULL,
    "discountPercentage" INTEGER,
    "reasonOfDiscount" TEXT,
    "extraMonths" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TraineeMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerSalary" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paymentType" "SalaryType" NOT NULL,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "SalaryStatus" NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerSalary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "category" "PostCategory" NOT NULL,
    "adminId" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "visibleTo" "UserGroup"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "relatedId" TEXT,
    "relatedType" "RelatedEntity",
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "recipientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraineeMembership" ADD CONSTRAINT "TraineeMembership_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraineeMembership" ADD CONSTRAINT "TraineeMembership_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_traineeMembershipId_fkey" FOREIGN KEY ("traineeMembershipId") REFERENCES "TraineeMembership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerSalary" ADD CONSTRAINT "TrainerSalary_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
