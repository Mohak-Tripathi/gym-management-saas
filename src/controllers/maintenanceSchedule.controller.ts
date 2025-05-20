

import { Request, Response, RequestHandler } from "express";
import { MaintenanceScheduleService } from "../services/maintenanceSchedule.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class MaintenanceScheduleController {
  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const { gymId } = req.user!;

      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      const maintenanceSchedule = await MaintenanceScheduleService.create({
        ...data,
        gymId
      });
      
      res.status(201).json({
        status: "success",
        data: maintenanceSchedule
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      const gymBranchId = req.query.gymBranchId as string;

      const maintenanceSchedules = await MaintenanceScheduleService.getAll(gymId, gymBranchId);
      
      res.status(200).json({
        status: "success",
        data: maintenanceSchedules
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { gymId } = req.user!;
      const gymBranchId = req.query.gymBranchId as string;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const maintenanceSchedule = await MaintenanceScheduleService.getById(id, gymId, gymBranchId);

      if (!maintenanceSchedule) {
        res.status(404).json({
          message: "Maintenance schedule not found",
          code: "MAINTENANCE_SCHEDULE_NOT_FOUND"
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: maintenanceSchedule
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const { gymId } = req.user!;
      const gymBranchId = req.query.gymBranchId as string;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const maintenanceSchedule = await MaintenanceScheduleService.update(id, data, gymId, gymBranchId);
      
      res.status(200).json({
        status: "success",
        data: maintenanceSchedule
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { gymId } = req.user!;
      const gymBranchId = req.query.gymBranchId as string;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      await MaintenanceScheduleService.delete(id, gymId, gymBranchId);
      
      res.status(200).json({
        status: "success",
        message: "Maintenance schedule deleted successfully"
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static getByEquipmentId: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { equipmentId } = req.params;
      const { gymId } = req.user!;
      const gymBranchId = req.query.gymBranchId as string;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const maintenanceSchedules = await MaintenanceScheduleService.getByEquipmentId(
        equipmentId,
        gymId,
        gymBranchId
      );

      res.status(200).json({
        status: "success",
        data: maintenanceSchedules
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static getUpcoming: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { gymId } = req.user!;
      const gymBranchId = req.query.gymBranchId as string;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const upcomingSchedules = await MaintenanceScheduleService.getUpcoming(gymId, gymBranchId);

      res.status(200).json({
        status: "success",
        data: upcomingSchedules
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };
}