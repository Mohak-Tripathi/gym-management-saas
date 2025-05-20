import { Request, Response, RequestHandler } from "express";
import { EquipmentService } from "../services/equipment.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class EquipmentController {
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
        const equipment = await EquipmentService.createEquipment({
            ...data,
            gymId,
          });
      res.status(201).json(equipment);
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
      const equipments = await EquipmentService.getAllEquipments(
        gymId as string,
        gymBranchId as string
      );


    res.json(equipments);
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

      const equipment = await EquipmentService.getEquipmentById(id, gymId, gymBranchId);

      if (!equipment) {
        res.status(404).json({
          message: "Gym Equipment not found",
          code: "GYM_EQUIPMENT_NOT_FOUND",
        });
        return;
      }

      res.json(equipment);
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

      const equipment = await EquipmentService.updateEquipment(id, data, gymId, gymBranchId);
      res.json(equipment);
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

      await EquipmentService.deleteEquipment(id, gymId, gymBranchId);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };
}











