



import { TrainerDB } from "../database/trainer.database";
import { AppError } from "../utils/AppError";
import { sendPasswordSetupEmail } from "../utils/emailService";


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import crypto from 'crypto';
import { addMinutes } from 'date-fns';


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

  static async onBoardTrainer(data: any) {
    const {
      userData, // contains email, password, fullName, role (should be TRAINER), etc.
      trainerData, // contains specialization, experience, etc.
    } = data;

    try {
      if (userData.role !== 'TRAINER') {
        throw new AppError("Invalid user role for trainer onboarding", 400, "INVALID_ROLE");
      }

      const result = await prisma.$transaction(async (tx: any) => {
        // 1. Create User
        const user = await tx.user.create({
          data: userData,
        });

        // 2. Create Trainer linked to User
        const trainer = await tx.trainer.create({
          data: {
            ...trainerData,
            userId: user.id,
          },
        });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = addMinutes(new Date(), 60);

        await tx.passwordSetupToken.create({
          data: { token, userId: user.id, expiresAt },
        });

        return { user, trainer, token };
      });

      // 📤 Email logic AFTER transaction
      await sendPasswordSetupEmail(result.user.email, result.token);

      return result;
   
  }
  catch (error) {
    console.error("Onboarding Error:", error);
    throw new AppError(
      "Error onboarding trainer",
      500,
      "TRAINER_ONBOARDING_ERROR"
    );
  }
}

static async getAllTrainers(gymId: string) {
  try {
    return await TrainerDB.getAll(gymId);
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

static async getTrainerById(id: string, gymId: string) {
  try {
    return await TrainerDB.getById(id, gymId);
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

static async updateTrainer(id: string, data: any) {
  try {
    return await TrainerDB.update(id, data);
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

static async deleteTrainer(id: string, gymId: string) {
  try {
    return await TrainerDB.delete(id, gymId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Error deleting trainer with ID: ${id}`,
      500,
      "TRAINER_SERVICE_DELETE_ERROR"
    );
  }
}

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

  // static async updateTrainer(id: string, data: unknown) {
  //   try {
  //     const trainer = await TrainerDB.update(id, data);
  //     return trainer;
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  //     throw new AppError(
  //       `Error updating trainer with ID: ${id}`,
  //       500,
  //       "TRAINER_SERVICE_UPDATE_ERROR"
  //     );
  //   }
  // }

  // static async deleteTrainer(id: string) {
  //   try {
  //     const trainer = await TrainerDB.delete(id);
  //     return trainer;
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
}
