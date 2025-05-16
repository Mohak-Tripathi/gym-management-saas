

import { Request, Response, RequestHandler } from "express";
import { CrmLeadService } from "../services/crmLead.service"
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class CrmLeadController {
  static createCRMLead: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const { gymId } = req.user!; // Get both gymId and branchId from authenticated user

    if (!gymId) {
      throw new Error("Gym ID and Branch ID are required");
    }

    try {
      const crmlead = await CrmLeadService.create({
        ...data,
        gymId
      });
      res.status(201).json(crmlead);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static getAllCRMLeads: RequestHandler = async (req: Request, res: Response) => {
    try {

      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const crmLeads = await CrmLeadService.getAll(
        gymId,
        gymBranchId
      );
      res.json(crmLeads);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static getCRMLeadById: RequestHandler = async (req: Request, res: Response) => {
    try {

      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
   
      const crmLead = await CrmLeadService.getById(
        id,
        gymId,
        gymBranchId
      );

      if (!crmLead) {
        res.status(404).json({
          message: "Crm Lead not found",
          code: "CRM_LEAD_NOT_FOUND"
        });
        return;
      }

      res.json(crmLead);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static updateCRMLead: RequestHandler = async (req: Request, res: Response) => {
    try {

      const { id } = req.params;
      const data = req.body;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
 
      const crmLead = await CrmLeadService.update(  id,
        data,
        gymId,
        gymBranchId);
      res.json(crmLead);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static deleteCRMLead: RequestHandler = async (req: Request, res: Response) => {
    try {

      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

   
      await CrmLeadService.delete(id, gymId, gymBranchId);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}
