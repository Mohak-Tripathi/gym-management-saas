import { TrainerDB } from "../database/trainer.database";
import { AppError } from "../utils/AppError";
import { sendPasswordSetupEmail } from "../utils/emailService";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import crypto from "crypto";
import { addMinutes } from "date-fns";
import { hashPassword } from "../utils/hashPassword";
import { uploadImageToS3 } from "../utils/s3";

export class TrainerService {
  // static async createTrainer(data: any) {
  //   try {
  //     const trainer = await TrainerDB.create(data);
  //     return trainer;
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  //     throw new AppError(
  //       "Error creating trainer",
  //       500,
  //       "TRAINER_SERVICE_CREATE_ERROR"
  //     );
  //   }
  // }

  static async onBoardTrainer(data: any, file?: Express.Multer.File) {
    const {
      userData, // contains email, password, fullName, role (should be TRAINER), etc.
      trainerData, // contains specialization, experience, etc.
    } = data;

    try {
      if (userData.role !== "TRAINER") {
        throw new AppError(
          "Invalid user role for trainer onboarding",
          400,
          "INVALID_ROLE"
        );
      }

                // Upload image if present
    let imageData = {};
    if (file) {
      const { key, name: originalName, mime } = await uploadImageToS3(file, 'user-profile-images');
      imageData = {
        imageUrl: key,
        imageName: originalName,
        mimeType: mime,
      };
    }


      console.log(data, "data23");
      // Generate a secure random password
      const plainPassword = crypto.randomBytes(12).toString("hex"); // 24 character random string
      // Hash the password for storage
      const hashedPassword = await hashPassword(plainPassword);

      const result = await prisma.$transaction(async (tx: any) => {
        // 1. Create User
        const user = await tx.user.create({
          data: {
            ...userData,
            password: hashedPassword, // Store hashed password
            ...imageData, // 🆕 add image data
          },
        });

        // 2. Create Trainer linked to User
        const trainer = await tx.trainer.create({
          data: {
            ...trainerData,
            userId: user.id,
          },
        });

        // const token = crypto.randomBytes(32).toString('hex');
        // const expiresAt = addMinutes(new Date(), 60);

        // await tx.passwordSetupToken.create({
        //   data: { token, userId: user.id, expiresAt },
        // });

        // return { user, trainer, token };
        return { user, trainer, plainPassword };
      });

      // 📤 Email logic AFTER transaction
      await sendPasswordSetupEmail(result.user.email, result.plainPassword);

      return result;
    } catch (error) {
      console.error("Onboarding Error:", error);
      throw new AppError(
        "Error onboarding trainer",
        500,
        "TRAINER_ONBOARDING_ERROR"
      );
    }
  }

  static async getAllTrainers(gymId: string, gymBranchId: string) {
    try {
      return await TrainerDB.getAll(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching trainers",
        500,
        "TRAINER_SERVICE_GET_ALL_ERROR"
      );
    }
  }

  static async getTrainerById(id: string, gymId: string, gymBranchId: string) {
    try {
      const trainer = await TrainerDB.getById(id, gymId, gymBranchId);

      if (!trainer) {
        throw new AppError(
          "Trainer not found",
          404,
          "TRAINER_SERVICE_NOT_FOUND_ERROR"
        );
      }
      return trainer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error fetching trainer with ID: ${id}`,
        500,
        "TRAINER_SERVICE_GET_BY_ID_ERROR"
      );
    }
  }

  static async updateTrainer(
    id: string,
    data: any,
    gymId: string,
    gymBranchId: string
  ) {
    try {
      return await TrainerDB.update(id, data, gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error updating trainer with ID: ${id}`,
        500,
        "TRAINER_SERVICE_UPDATE_ERROR"
      );
    }
  }

  // static async deleteTrainer(id: string, gymId: string, gymBranchId: string) {
  //   try {
  //     return await TrainerDB.delete(id, gymId, gymBranchId);
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  //     throw new AppError(
  //       `Error deleting trainer with ID: ${id}`,
  //       500,
  //       "TRAINER_SERVICE_DELETE_ERROR"
  //     );
  //   }
  // }

  // static async getAllTrainers() {
  //   try {
  //     const trainers = await TrainerDB.getAll();
  //     return trainers;
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  //     throw new AppError(
  //       "Error fetching trainers",
  //       500,
  //       "TRAINER_SERVICE_FETCH_ALL_ERROR"
  //     );
  //   }
  // }

  // static async getTrainerById(id: string) {
  //   try {
  //     const trainer = await TrainerDB.getById(id);
  //     if (!trainer) {
  //       throw new AppError(
  //         "Trainer not found",
  //         404,
  //         "TRAINER_SERVICE_NOT_FOUND_ERROR"
  //       );
  //     }
  //     return trainer;
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  //     throw new AppError(
  //       `Error fetching trainer with ID: ${id}`,
  //       500,
  //       "TRAINER_SERVICE_FETCH_BY_ID_ERROR"
  //     );
  //   }
  // }

  static async deleteTrainer(id: string, gymId: string, gymBranchId: string) {
    try {
      // 1. Fetch the trainer and associated user
      // const trainer = await prisma.trainer.findFirst({
      //   where: {
      //     id,
      //   },
      // });
      const trainer = await prisma.trainer.findUnique({ where: { id } });

      if (!trainer) {
        throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
      }
      console.log(trainer,  gymId, gymBranchId, "trainerr")

      // Step 2: Explicitly check tenant scoping
      if (trainer.gymId !== gymId || trainer.gymBranchId !== gymBranchId) {
        throw new AppError("Unauthorized access", 403, "UNAUTHORIZED_ACCESS");
      }

      // 2. Transactional delete
      await prisma.$transaction([
        prisma.trainer.delete({
          where: { id },
        }),
        prisma.user.delete({
          where: { id: trainer.userId },
        }),
      ]);

      // 3. Return success data
      return {
        message: "Trainer deleted successfully",
        trainerId: id,
        userId: trainer.userId,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Error deleting trainer with ID: ${id}`,
        500,
        "TRAINER_SERVICE_DELETE_ERROR"
      );
    }
  }
}
