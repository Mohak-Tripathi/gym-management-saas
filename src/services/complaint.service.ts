import { ComplaintDatabase } from "../database/complaint.database";
import { AppError } from "../utils/AppError";

export class ComplaintService {
  static async createComplaint(data: any) {
    try {
      return await ComplaintDatabase.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error creating Complaint",
        500,
        "Complaint_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAllComplaints(gymId: string, gymBranchId: string) {
    try {
      return await ComplaintDatabase.getAll(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error fetching Complaints",
        500,
        "Complaint_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getComplaintById(id: string, gymId: string, branchId: string) {
    try {
      const complaint = await ComplaintDatabase.getById(id, gymId, branchId);
      if (!complaint) {
        throw new AppError(
          "complaint not found",
          404,
          "complaint_NOT_FOUND"
        );
      }
      return complaint;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error fetching complaint with ID: ${id}`,
        500,
        "complaint_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async updateComplaint(id: string, data: any, gymId: string, branchId: string) {
    try {
      const Complaint = await ComplaintDatabase.getById(id, gymId, branchId);
      if (!Complaint) {
        throw new AppError(
          "Complaint not found",
          404,
          "Complaint_NOT_FOUND"
        );
      }
      return await ComplaintDatabase.update(id, { ...data, gymId, gymBranchId: branchId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error updating Complaint with ID: ${id}`,
        500,
        "Complaint_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async deleteComplaint(id: string, gymId: string, branchId: string) {
    try {
      const Complaint = await ComplaintDatabase.getById(id, gymId, branchId);
      if (!Complaint) {
        throw new AppError(
          "Complaint not found",
          404,
          "Complaint_NOT_FOUND"
        );
      }
      return await ComplaintDatabase.delete(id, gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error deleting COMPLAINT with ID: ${id}`,
        500,
        "COMPLAINT_SERVICE_DELETE_ERROR"
      );
    }
  }
}