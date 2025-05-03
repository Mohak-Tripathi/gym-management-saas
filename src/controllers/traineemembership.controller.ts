// ✅ Controller Layer - src/controllers/traineemembership.controller.ts
import { Request, Response } from "express";
import { TraineeMembershipService } from "../services/traineemembership.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class TraineeMembershipController {
//   static async create(req: Request, res: Response) {
//     try {
//       const traineeMembership = await TraineeMembershipService.createTraineeMembership(req.body);
//       res.status(201).json({
//         status: "success",
//         data: traineeMembership
//       });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }

  static async getAll(req: Request, res: Response) {
    try {

      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const traineeMemberships = await TraineeMembershipService.getAllTraineeMemberships(gymId, gymBranchId);
      
      res.status(200).json({
        status: "success",
        data: traineeMemberships
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

      const traineeMembership = await TraineeMembershipService.getTraineeMembershipById(id, gymId, gymBranchId);
      res.status(200).json({
        status: "success",
        data: traineeMembership
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

      const traineeMembership = await TraineeMembershipService.updateTraineeMembership(
        id,
        data,
        gymId,
        gymBranchId
      );
      res.status(200).json({
        status: "success",
        data: traineeMembership
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

      await TraineeMembershipService.deleteTraineeMembership(id, gymId, gymBranchId);
      res.status(204).json({
        status: "success",
        data: null
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}
