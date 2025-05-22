import { Request, Response, RequestHandler } from "express";
import { FeedbackService } from "../services/feedback.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class FeedbackController {
  static create: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const data = req.body;
    const { gymId } = req.user!; // Get both gymId and branchId from authenticated user

    if (!gymId) {
      throw new Error("Gym ID and Branch ID are required");
    }

    try {
        const feedback = await FeedbackService.createFeedback({
            ...data,
            gymId,
          });
      res.status(201).json(feedback);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static getAll: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;
      const feedbacks = await FeedbackService.getAllFeedbacks(
        gymId as string,
        gymBranchId as string
      );


    res.json(feedbacks);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static getById: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const feedback = await FeedbackService.getFeedbackById(id, gymId, gymBranchId);

      if (!feedback) {
        res.status(404).json({
          message: "Feedback not found",
          code: "FEEDBACK_NOT_FOUND",
        });
        return;
      }

      res.json(feedback);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static update: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const feedback = await FeedbackService.updateFeedback(id, data, gymId, gymBranchId);
      res.json(feedback);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static delete: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      await FeedbackService.deleteFeedback(id, gymId, gymBranchId);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };
}











