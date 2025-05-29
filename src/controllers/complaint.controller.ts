import { Request, Response, RequestHandler } from "express";
import { ComplaintService } from "../services/complaint.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class ComplaintController {
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
        const Complaint = await ComplaintService.createComplaint({
            ...data,
            gymId,
          });
      res.status(201).json(Complaint);
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
      const Complaints = await ComplaintService.getAllComplaints(
        gymId as string,
        gymBranchId as string
      );


    res.json(Complaints);
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

      const Complaint = await ComplaintService.getComplaintById(id, gymId, gymBranchId);

      if (!Complaint) {
        res.status(404).json({
          message: "Complaint not found",
          code: "Complaint_NOT_FOUND",
        });
        return;
      }

      res.json(Complaint);
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

      const Complaint = await ComplaintService.updateComplaint(id, data, gymId, gymBranchId);
      res.json(Complaint);
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

      await ComplaintService.deleteComplaint(id, gymId, gymBranchId);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };
}











