// import { CommunityPostDatabase } from "../database/communityPost.database";
import { EquipmentDatabase } from "../database/equipment.database";
import { AppError } from "../utils/AppError";


export class  EquipmentService {
  static async createEquipment(data: any, file?: Express.Multer.File) {
    try {
      return await EquipmentDatabase.create(data, file);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error creating equipment",
        500,
        "GYM_EQUIPMENT_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAllEquipments(gymId: string, gymBranchId: string) {
    try {
      return await EquipmentDatabase.getAll(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error fetching gym eqipment",
        500,
        "GYM_EQUIPMENT_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getEquipmentById(id: string, gymId: string, branchId: string) {
    try {
      const post = await EquipmentDatabase.getById(id, gymId, branchId);
      if (!post) {
        throw new AppError(
          "Equipment not found",
          404,
          "GYM_EQUIPMENT_NOT_FOUND"
        );
      }
      return post;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error fetching post with ID: ${id}`,
        500,
        "GYM_EQUIPMENT_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async updateEquipment(id: string, data: any, gymId: string, branchId: string, file?: Express.Multer.File   ) {
    try {
      const equipment = await EquipmentDatabase.getById(id, gymId, branchId);
      if (!equipment) {
        throw new AppError(
          "Gym Equipment not found",
          404,
          "GYM_EQUIPMENT_NOT_FOUND"
        );
      }
      return await EquipmentDatabase.update(id, { ...data, gymId, gymBranchId: branchId }, file);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error updating post with ID: ${id}`,
        500,
        "GYM_EQUIPMENT_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async deleteEquipment(id: string, gymId: string, branchId: string) {
    try {
      const equipment = await EquipmentDatabase.getById(id, gymId, branchId);
      if (!equipment) {
        throw new AppError(
          "Gym Equipment not found",
          404,
          "GYM_EQUIPMENT_NOT_FOUND"
        );
      }
      return await EquipmentDatabase.delete(id, gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error deleting post with ID: ${id}`,
        500,
        "GYM_EQUIPMENT_SERVICE_DELETE_ERROR"
      );
    }
  }
}
