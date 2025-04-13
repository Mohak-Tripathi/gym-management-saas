// ✅ Service Layer - src/services/trainee.service.ts
import { TraineeDatabase } from "../database/trainee.database";
import { AppError } from "../utils/AppError";

export class TraineeService {
  static async createTrainee(data: any) {
    try {
      const trainee = await TraineeDatabase.create(data);
      return trainee;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error creating trainee",
        500,
        "TRAINEE_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAllTrainees() {
    try {
      const trainees = await TraineeDatabase.getAll();
      return trainees;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching trainees",
        500,
        "TRAINEE_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getTraineeById(id: string) {
    try {
      const trainee = await TraineeDatabase.getById(id);
      if (!trainee) {
        throw new AppError(
          "Trainee not found",
          404,
          "TRAINEE_SERVICE_NOT_FOUND_ERROR"
        );
      }
      return trainee;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error fetching trainee with ID: ${id}`,
        500,
        "TRAINEE_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async updateTrainee(id: string, data: any) {
    try {
      const trainee = await TraineeDatabase.update(id, data);
      return trainee;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error updating trainee with ID: ${id}`,
        500,
        "TRAINEE_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async deleteTrainee(id: string) {
    try {
      await TraineeDatabase.delete(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error deleting trainee with ID: ${id}`,
        500,
        "TRAINEE_SERVICE_DELETE_ERROR"
      );
    }
  }
}