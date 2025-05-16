// import { CommunityPostDatabase } from "../database/communityPost.database";
import { CrmLeadDatabase } from "../database/crmLead.database";
import { AppError } from "../utils/AppError";

export class CrmLeadService {
  static async create(data: any) {
    try {
      return await CrmLeadDatabase.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error creating crm lead",
        500,
        "CRM_LEAD_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      return await CrmLeadDatabase.getAll(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error fetching crem leads",
        500,
        "CRM_LEAD_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId: string) {
    try {
      const post = await CrmLeadDatabase.getById(id, gymId, branchId);
      if (!post) {
        throw new AppError(
          "Crm lead not found",
          404,
          "CRM_LEAD_NOT_FOUND"
        );
      }
      return post;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error fetching post with ID: ${id}`,
        500,
        "CRM_LEAD_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any, gymId: string, branchId: string) {
    try {
      const post = await CrmLeadDatabase.getById(id, gymId, branchId);
      if (!post) {
        throw new AppError(
          "Crm lead not found",
          404,
          "CRM_LEAD_NOT_FOUND"
        );
      }
      return await CrmLeadDatabase.update(id, { ...data, gymId, gymBranchId: branchId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error updating post with ID: ${id}`,
        500,
        "CRM_LEAD_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, branchId: string) {
    try {
      const post = await CrmLeadDatabase.getById(id, gymId, branchId);
      if (!post) {
        throw new AppError(
          "Crm lead not found",
          404,
          "CRM_LEAD_NOT_FOUND"
        );
      }
      return await CrmLeadDatabase.delete(id, gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error deleting post with ID: ${id}`,
        500,
        "CRM_LEAD_SERVICE_DELETE_ERROR"
      );
    }
  }
}
