import { CommunityPostDatabase } from "../database/communityPost.database";
import { AppError } from "../utils/AppError";

export class CommunityPostService {
  static async create(data: any,  files?: Express.Multer.File[]) {
    try {
      return await CommunityPostDatabase.create(data, files);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error creating community post",
        500,
        "COMMUNITY_POST_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      return await CommunityPostDatabase.getAll(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error fetching community posts",
        500,
        "COMMUNITY_POST_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId: string) {
    try {
      const post = await CommunityPostDatabase.getById(id, gymId, branchId);
      if (!post) {
        throw new AppError(
          "Community post not found",
          404,
          "COMMUNITY_POST_NOT_FOUND"
        );
      }
      return post;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error fetching post with ID: ${id}`,
        500,
        "COMMUNITY_POST_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any, gymId: string, branchId: string) {
    try {
      const post = await CommunityPostDatabase.getById(id, gymId, branchId);
      if (!post) {
        throw new AppError(
          "Community post not found",
          404,
          "COMMUNITY_POST_NOT_FOUND"
        );
      }
      return await CommunityPostDatabase.update(id, { ...data, gymId, gymBranchId: branchId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error updating post with ID: ${id}`,
        500,
        "COMMUNITY_POST_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, branchId: string) {
    try {
      const post = await CommunityPostDatabase.getById(id, gymId, branchId);
      if (!post) {
        throw new AppError(
          "Community post not found",
          404,
          "COMMUNITY_POST_NOT_FOUND"
        );
      }
      return await CommunityPostDatabase.delete(id, gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error deleting post with ID: ${id}`,
        500,
        "COMMUNITY_POST_SERVICE_DELETE_ERROR"
      );
    }
  }
}
