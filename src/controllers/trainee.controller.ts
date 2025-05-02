// ✅ Controller Layer - src/controllers/trainee.controller.ts
import { Request, Response } from "express";
import { TraineeService } from "../services/trainee.service";
import { handleErrorResponse } from "../utils/handleErrorResponse"




export class TraineeController {

  static async onboard(req: Request, res: Response) {
    try {

      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
  
      // Get gymBranchId from request body instead of user context
      const { userData, traineeData,  traineeMembershipData } = req.body;
      
      if (!traineeData.gymBranchId) {
        throw new Error("Gym Branch ID is required in trainer data");
      }
  
      const enrichedData = {
        userData: { 
          ...userData, 
          gymId,
          gymBranchId: traineeData.gymBranchId  // Use branch ID from request
        },
        trainerData: { 
          ...traineeData, 
          gymId,
          // gymBranchId already exists in trainerData
        },
        traineeMembershipData : {
          ...traineeMembershipData,
          gymId,
          gymBranchId: traineeData.gymBranchId
        }

      };
  
      console.log("Enriched data:", enrichedData); // For debugging
  

      const result = await TraineeService.onboardTraineeWithMembership(enrichedData);
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
        data: trainees
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
      const trainee = await TraineeService.getTraineeById(id, gymId, gymBranchId);
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
      // If using query parameter approach
    const gymBranchId = req.query.gymBranchId as string;

      const data = req.body;
      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
      const trainee = await TraineeService.updateTrainee(id, data, gymId, gymBranchId);
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
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
      await TraineeService.deleteTrainee(id, gymId, gymBranchId);
      res.status(204).json({
        status: "success",
        data: null
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}