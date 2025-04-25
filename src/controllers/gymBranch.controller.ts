import { Request, Response } from 'express';
import { GymBranchService } from '../services/gymBranch.service';
import { handleErrorResponse } from '../utils/handleErrorResponse';

export class GymBranchController {
  static async create(req: Request, res: Response) {
    try {
      const gymBranch = await GymBranchService.create(req.body);
       res.status(201).json(gymBranch);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const gymBranches = await GymBranchService.getAll();
      res.status(200).json(gymBranches);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const gymBranch = await GymBranchService.getById(id);

      if (!gymBranch) {
        res.status(404).json({
          message: "GymBranch not found",
          code: "GYM_BRANCH_NOT_FOUND"
        });
        return;
      }

       res.status(200).json(gymBranch);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedGymBranch = await GymBranchService.update(id, req.body);
       res.status(200).json(updatedGymBranch);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await GymBranchService.delete(id);
      res.status(204).send();
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}

