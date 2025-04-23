

import { Request, Response, RequestHandler } from "express";
import { CommunityPostService } from "../services/communityPost.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class CommunityPostController {
  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const post = await CommunityPostService.create(req.body);
      res.status(201).json(post);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const posts = await CommunityPostService.getAll();
      res.json(posts);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const post = await CommunityPostService.getById(id);

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
      const post = await CommunityPostService.update(id, data);
      res.json(post);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await CommunityPostService.delete(id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}
