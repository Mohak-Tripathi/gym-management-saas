// ✅ Controller Layer - src/controllers/trainee.controller.ts
import { Request, Response } from "express";
import { TraineeService } from "../services/trainee.service";
import { handleErrorResponse } from "../utils/handleErrorResponse"

export class TraineeController {
  // static async create(req: Request, res: Response) {
  //   try {
  //     const trainee = await TraineeService.createTrainee(req.body);
  //     res.status(201).json({
  //       status: "success",
  //       data: trainee
  //     });
  //   } catch (err) {
  //     handleErrorResponse(res, err);
  //   }
  // }


  static async onboard(req: Request, res: Response) {
    try {
      const data = req.body; // contains both traineeData and traineeMembershipData
      const result = await TraineeService.onboardTraineeWithMembership(data);
      res.status(201).json(result);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      const trainees = await TraineeService.getAllTrainees(gymId);
      res.status(200).json({
        status: "success",
        data: trainees
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { gymId, gymBranchId } = req.user!;
      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
      const trainee = await TraineeService.getTraineeById(id, gymId);
      res.status(200).json({
        status: "success",
        data: trainee
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const trainee = await TraineeService.updateTrainee(id, req.body);
      res.status(200).json({
        status: "success",
        data: trainee
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await TraineeService.deleteTrainee(id);
      res.status(204).json({
        status: "success",
        data: null
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}