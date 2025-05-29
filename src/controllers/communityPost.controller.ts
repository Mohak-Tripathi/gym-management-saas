

import { Request, Response, RequestHandler } from "express";
import { CommunityPostService } from "../services/communityPost.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class CommunityPostController {
  static create: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const files = req.files as Express.Multer.File[];
    const { gymId } = req.user!; // Get both gymId and branchId from authenticated user

    if (!gymId) {
      throw new Error("Gym ID and Branch ID are required");
    }

    try {
      const post = await CommunityPostService.create({
        ...data,
        gymId
      },  files)
      res.status(201).json(post);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {

      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const posts = await CommunityPostService.getAll(
        gymId,
        gymBranchId
      );
      res.json(posts);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {

      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
   
      const post = await CommunityPostService.getById(
        id,
        gymId,
        gymBranchId
      );

      if (!post) {
        res.status(404).json({
          message: "Community post not found",
          code: "COMMUNITY_POST_NOT_FOUND"
        });
        return;
      }

      res.json(post);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {

      const { id } = req.params;
      const data = req.body;
      const files = req.files as Express.Multer.File[]; // if using `upload.array()`

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
 
      const post = await CommunityPostService.update(  id,
        data,
        gymId,
        gymBranchId,  
        files);
      res.json(post);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {

      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

   
      await CommunityPostService.delete(id, gymId, gymBranchId);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}
