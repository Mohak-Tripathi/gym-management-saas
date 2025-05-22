import { FeedbackDatabase } from "../database/feedback.database";
import { AppError } from "../utils/AppError";

export class FeedbackService {
  static async createFeedback(data: any) {
    try {
      return await FeedbackDatabase.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error creating feedback",
        500,
        "FEEDBACK_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAllFeedbacks(gymId: string, gymBranchId: string) {
    try {
      return await FeedbackDatabase.getAll(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error fetching feedbacks",
        500,
        "FEEDBACK_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getFeedbackById(id: string, gymId: string, branchId: string) {
    try {
      const feedback = await FeedbackDatabase.getById(id, gymId, branchId);
      if (!feedback) {
        throw new AppError(
          "Feedback not found",
          404,
          "FEEDBACK_NOT_FOUND"
        );
      }
      return feedback;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error fetching feedback with ID: ${id}`,
        500,
        "FEEDBACK_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async updateFeedback(id: string, data: any, gymId: string, branchId: string) {
    try {
      const feedback = await FeedbackDatabase.getById(id, gymId, branchId);
      if (!feedback) {
        throw new AppError(
          "Feedback not found",
          404,
          "FEEDBACK_NOT_FOUND"
        );
      }
      return await FeedbackDatabase.update(id, { ...data, gymId, gymBranchId: branchId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error updating feedback with ID: ${id}`,
        500,
        "FEEDBACK_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async deleteFeedback(id: string, gymId: string, branchId: string) {
    try {
      const feedback = await FeedbackDatabase.getById(id, gymId, branchId);
      if (!feedback) {
        throw new AppError(
          "Feedback not found",
          404,
          "FEEDBACK_NOT_FOUND"
        );
      }
      return await FeedbackDatabase.delete(id, gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error deleting feedback with ID: ${id}`,
        500,
        "FEEDBACK_SERVICE_DELETE_ERROR"
      );
    }
  }
}