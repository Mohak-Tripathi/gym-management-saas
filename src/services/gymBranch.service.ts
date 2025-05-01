import { GymBranchDatabase } from "../database/gymBranch.repository";
import { AppError } from "../utils/AppError";

export class GymBranchService {
  static async create(data: any) {
    try {
      return await GymBranchDatabase.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error creating gym branch",
        500,
        "GYM_BRANCH_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string) {
    try {
      return await GymBranchDatabase.getAll(gymId); 
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error fetching gym branches",
        500,
        "GYM_BRANCH_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string) {
    try {
      const gymBranch = await GymBranchDatabase.getById(id, gymId);
      if (!gymBranch) {
        throw new AppError(
          "Gym branch not found",
          404,
          "GYM_BRANCH_NOT_FOUND_ERROR"
        );
      }
      return gymBranch;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error fetching gym branch with ID: ${id}`,
        500,
        "GYM_BRANCH_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any, gymId: string) {
    try {
      const existingGymBranch = await GymBranchDatabase.getById(id, gymId);
      if (!existingGymBranch) {
        throw new AppError(
          "Gym branch not found",
          404,
          "GYM_BRANCH_NOT_FOUND_ERROR"
        );
      }
      return await GymBranchDatabase.update(id, data, gymId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error updating gym branch with ID: ${id}`,
        500,
        "GYM_BRANCH_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string) {
    try {
      const existingGymBranch = await GymBranchDatabase.getById(id, gymId);
      if (!existingGymBranch) {
        throw new AppError(
          "Gym branch not found",
          404,
          "GYM_BRANCH_NOT_FOUND_ERROR"
        );
      }
      return await GymBranchDatabase.delete(id, gymId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error deleting gym branch with ID: ${id}`,
        500,
        "GYM_BRANCH_SERVICE_DELETE_ERROR"
      );
    }
  }
}
