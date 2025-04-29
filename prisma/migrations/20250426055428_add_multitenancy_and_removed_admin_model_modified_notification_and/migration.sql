/*
  Warnings:

  - You are about to drop the column `adminId` on the `CommunityPost` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gymBranchId` to the `CommunityPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `CommunityPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CommunityPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymBranchId` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymBranchId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymBranchId` to the `PasswordSetupToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `PasswordSetupToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymBranchId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `Trainee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymBranchId` to the `TraineeMembership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `TraineeMembership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TraineeMembership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymBranchId` to the `TrainerSalary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `TrainerSalary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymBranchId` to the `WorkoutPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `WorkoutPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommunityPost" DROP CONSTRAINT "CommunityPost_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_recipientId_fkey";

-- AlterTable
ALTER TABLE "CommunityPost" DROP COLUMN "adminId",
ADD COLUMN     "gymBranchId" TEXT NOT NULL,
ADD COLUMN     "gymId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "gymBranchId" TEXT NOT NULL,
ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "gymBranchId" TEXT NOT NULL,
ADD COLUMN     "gymId" TEXT NOT NULL,
ADD COLUMN     "targetRole" "UserRole";

-- AlterTable
ALTER TABLE "PasswordSetupToken" ADD COLUMN     "gymBranchId" TEXT NOT NULL,
ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "gymBranchId" TEXT NOT NULL,
ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trainee" ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TraineeMembership" ADD COLUMN     "gymBranchId" TEXT NOT NULL,
ADD COLUMN     "gymId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrainerSalary" ADD COLUMN     "gymBranchId" TEXT NOT NULL,
ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutPlan" ADD COLUMN     "gymBranchId" TEXT NOT NULL,
ADD COLUMN     "gymId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- CreateIndex
CREATE INDEX "CommunityPost_gymId_gymBranchId_idx" ON "CommunityPost"("gymId", "gymBranchId");

-- CreateIndex
CREATE INDEX "CommunityPost_userId_idx" ON "CommunityPost"("userId");

-- CreateIndex
CREATE INDEX "GymBranch_gymId_idx" ON "GymBranch"("gymId");

-- CreateIndex
CREATE INDEX "Notification_gymId_gymBranchId_idx" ON "Notification"("gymId", "gymBranchId");

-- CreateIndex
CREATE INDEX "Notification_recipientId_idx" ON "Notification"("recipientId");

-- CreateIndex
CREATE INDEX "Payment_gymId_idx" ON "Payment"("gymId");

-- CreateIndex
CREATE INDEX "Trainee_gymId_idx" ON "Trainee"("gymId");

-- CreateIndex
CREATE INDEX "Trainee_gymBranchId_idx" ON "Trainee"("gymBranchId");

-- CreateIndex
CREATE INDEX "TraineeMembership_gymId_idx" ON "TraineeMembership"("gymId");

-- CreateIndex
CREATE INDEX "Trainer_gymId_idx" ON "Trainer"("gymId");

-- CreateIndex
CREATE INDEX "Trainer_gymBranchId_idx" ON "Trainer"("gymBranchId");

-- CreateIndex
CREATE INDEX "TrainerSalary_gymId_idx" ON "TrainerSalary"("gymId");

-- CreateIndex
CREATE INDEX "User_gymId_idx" ON "User"("gymId");

-- CreateIndex
CREATE INDEX "User_gymBranchId_idx" ON "User"("gymBranchId");

-- CreateIndex
CREATE INDEX "WorkoutPlan_gymId_idx" ON "WorkoutPlan"("gymId");

-- AddForeignKey
ALTER TABLE "Trainee" ADD CONSTRAINT "Trainee_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraineeMembership" ADD CONSTRAINT "TraineeMembership_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraineeMembership" ADD CONSTRAINT "TraineeMembership_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerSalary" ADD CONSTRAINT "TrainerSalary_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerSalary" ADD CONSTRAINT "TrainerSalary_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordSetupToken" ADD CONSTRAINT "PasswordSetupToken_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordSetupToken" ADD CONSTRAINT "PasswordSetupToken_gymBranchId_fkey" FOREIGN KEY ("gymBranchId") REFERENCES "GymBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
