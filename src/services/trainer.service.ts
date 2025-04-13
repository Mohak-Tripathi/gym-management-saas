import { TrainerDB } from "../database/trainer.database";
import { AppError } from "../utils/AppError";

export class TrainerService {
  static async createTrainer(data: any) {
    try {
      const trainer = await TrainerDB.create(data);
      return trainer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error creating trainer",
        500,
        "TRAINER_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAllTrainers() {
    try {
      const trainers = await TrainerDB.getAll();
      return trainers;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching trainers",
        500,
        "TRAINER_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getTrainerById(id: string) {
    try {
      const trainer = await TrainerDB.getById(id);
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
        "TRAINER_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async updateTrainer(id: string, data: unknown) {
    try {
      const trainer = await TrainerDB.update(id, data);
      return trainer;
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

  static async deleteTrainer(id: string) {
    try {
      const trainer = await TrainerDB.delete(id);
      return trainer;
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
}
