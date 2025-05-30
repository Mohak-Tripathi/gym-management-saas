import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class ComplaintDatabase {
  static async create(data: any) {
    try {
      if (!data.gymId || !data.message || !data.gymBranchId) {
        throw new AppError(
          "Gym ID is required",
          400,
          "COMPLAINT_GYM_ID_REQUIRED"
        );
      }
      
      // Only include userId if it exists in the data
      // const createData = {
      //   message: data.message,
      //   gymId: data.gymId,
      //   ...(data.userId && { userId: data.userId }),
      //   ...(data.gymBranchId && { gymBranchId: data.gymBranchId })
      // };
      
      return await prisma.complaint.create({ 
        data: data,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true,
              address: true
            }
          }
        }
      });
    } catch (error) {
      console.error("Complaint Create Error:", error);
      throw new AppError(
        "Error creating complaint",
        500,
        "COMPLAINT_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, branchId?: string) {
    try {
      if (!gymId) {
        throw new AppError(
          "Gym ID is required",
          400,
          "COMPLAINT_GYM_ID_REQUIRED"
        );
      }

      const whereClause = {
        gymId,
        ...(branchId && { gymBranchId: branchId })
      };

      return await prisma.complaint.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true,
              address: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    } catch (error) {
      console.error("COMPLAINT Fetch All Error:", error);
      throw new AppError(
        "Error fetching COMPLAINTs",
        500,
        "COMPLAINT_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId?: string) {
    try {
      if (!gymId) {
        throw new AppError(
          "Gym ID is required",
          400,
          "COMPLAINT_GYM_ID_REQUIRED"
        );
      }

      const whereClause = {
        id,
        gymId,
        ...(branchId && { gymBranchId: branchId })
      };

      return await prisma.complaint.findFirst({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true,
              address: true
            }
          }
        }
      });
    } catch (error) {
      console.error("Complaint GetById Error:", error);
      throw new AppError(
        `Error fetching Complaint with ID: ${id}`,
        500,
        "Complaint_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      // Only include userId and gymBranchId if they exist in the data
      // const updateData = {
      //   message: data.message,
      //   ...(data.userId && { userId: data.userId }),
      //   ...(data.gymBranchId && { gymBranchId: data.gymBranchId })
      // };
      const updateData = {
        ...(data.subject && { subject: data.subject }),
        ...(data.message && { message: data.message }),
        ...(data.userId && { userId: data.userId }),
        ...(data.gymBranchId && { gymBranchId: data.gymBranchId }),
        ...(data.status && { status: data.status }),
        ...(data.response && { response: data.response })
      };

      return await prisma.complaint.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true,
              address: true
            }
          }
        }
      });
    } catch (error) {
      console.error("Complaint Update Error:", error);
      throw new AppError(
        `Error updating Complaint with ID: ${id}`,
        500,
        "Complaint_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, branchId?: string) {
    try {
      const whereClause = {
        id,
        gymId,
        ...(branchId && { gymBranchId: branchId })
      };

      return await prisma.complaint.delete({
        where: whereClause
      });
    } catch (error) {
      console.error("complaint Delete Error:", error);
      throw new AppError(
        `Error deleting complaint with ID: ${id}`,
        500,
        "complaint_DB_DELETE_ERROR"
      );
    }
  }
}