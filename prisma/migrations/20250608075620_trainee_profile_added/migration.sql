-- CreateEnum
CREATE TYPE "TrainingExperience" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'ATHLETE');

-- AlterTable
ALTER TABLE "Trainee" ADD COLUMN     "activityLevel" "ActivityLevel",
ADD COLUMN     "motivationSource" TEXT,
ADD COLUMN     "pushupCount" INTEGER,
ADD COLUMN     "targetMuscleGroups" TEXT[],
ADD COLUMN     "trainingExperience" "TrainingExperience",
ADD COLUMN     "wantsNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "workoutDuration" INTEGER,
ADD COLUMN     "workoutFrequency" INTEGER;
