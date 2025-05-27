// ✅ Controller Layer - src/controllers/trainee.controller.ts
import { Request, Response } from "express";
import { TraineeService } from "../services/trainee.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class TraineeController {
  static async onboard(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      const file = req.file; // ✅ Get uploaded image
      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      // Get gymBranchId from request body instead of user context

      const userData = JSON.parse(req.body.userData);
      const traineeData = JSON.parse(req.body.traineeData);
      const traineeMembershipData = JSON.parse(req.body.traineeMembershipData);

      if (!traineeData.gymBranchId) {
        throw new Error("Gym Branch ID is required in trainee data");
      }

      const enrichedData = {
        userData: {
          ...userData,
          gymId,
          gymBranchId: traineeData.gymBranchId, // Use branch ID from request
        },
        traineeData: {
          ...traineeData,
          gymId,
          // gymBranchId already exists in trainerData
        },
        traineeMembershipData: {
          ...traineeMembershipData,
          gymId,
          gymBranchId: traineeData.gymBranchId,
        },
      };

      console.log("Enriched data:", enrichedData); // For debugging

      const result = await TraineeService.onboardTraineeWithMembership(
        enrichedData,
        file
      );
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
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const trainees = await TraineeService.getAllTrainees(gymId, gymBranchId);
      res.status(200).json({
        status: "success",
        data: trainees,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
      const trainee = await TraineeService.getTraineeById(
        id,
        gymId,
        gymBranchId
      );
      res.status(200).json({
        status: "success",
        data: trainee,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { gymId } = req.user!;
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const { userData, traineeData, traineeMembershipData } = req.body;

      const enrichedData = {
        userData: userData ? { ...userData, gymId, gymBranchId } : undefined,
        traineeData: traineeData
          ? { ...traineeData, gymId, gymBranchId }
          : undefined,
        traineeMembershipData: traineeMembershipData
          ? { ...traineeMembershipData, gymId, gymBranchId }
          : undefined,
      };

      const trainee = await TraineeService.updateTrainee(
        id,
        enrichedData,
        gymId,
        gymBranchId
      );
      res.status(200).json({
        status: "success",
        data: trainee,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
      const result = await TraineeService.deleteTrainee(id, gymId, gymBranchId);

      res.status(200).json({
        status: "success",
        result,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}
