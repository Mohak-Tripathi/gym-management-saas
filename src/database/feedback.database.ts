import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class FeedbackDatabase {
  static async create(data: any) {
    try {
      if (!data.gymId) {
        throw new AppError(
          "Gym ID is required",
          400,
          "FEEDBACK_GYM_ID_REQUIRED"
        );
      }
      
      // Only include userId if it exists in the data
      const createData = {
        message: data.message,
        gymId: data.gymId,
        ...(data.userId && { userId: data.userId }),
        ...(data.gymBranchId && { gymBranchId: data.gymBranchId })
      };
      
      return await prisma.feedback.create({ 
        data: createData,
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
      console.error("Feedback Create Error:", error);
      throw new AppError(
        "Error creating feedback",
        500,
        "FEEDBACK_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, branchId?: string) {
    try {
      if (!gymId) {
        throw new AppError(
          "Gym ID is required",
          400,
          "FEEDBACK_GYM_ID_REQUIRED"
        );
      }

      const whereClause = {
        gymId,
        ...(branchId && { gymBranchId: branchId })
      };

      return await prisma.feedback.findMany({
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
      console.error("Feedback Fetch All Error:", error);
      throw new AppError(
        "Error fetching feedbacks",
        500,
        "FEEDBACK_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId?: string) {
    try {
      if (!gymId) {
        throw new AppError(
          "Gym ID is required",
          400,
          "FEEDBACK_GYM_ID_REQUIRED"
        );
      }

      const whereClause = {
        id,
        gymId,
        ...(branchId && { gymBranchId: branchId })
      };

      return await prisma.feedback.findFirst({
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
      console.error("Feedback GetById Error:", error);
      throw new AppError(
        `Error fetching feedback with ID: ${id}`,
        500,
        "FEEDBACK_DB_FETCH_BY_ID_ERROR"
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
        ...(data.message && { message: data.message }),
        ...(data.userId && { userId: data.userId }),
        ...(data.gymBranchId && { gymBranchId: data.gymBranchId }),
        ...(data.response && { response: data.response })
      };
      
      return await prisma.feedback.update({
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
      console.error("Feedback Update Error:", error);
      throw new AppError(
        `Error updating feedback with ID: ${id}`,
        500,
        "FEEDBACK_DB_UPDATE_ERROR"
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

      return await prisma.feedback.delete({
        where: whereClause
      });
    } catch (error) {
      console.error("Feedback Delete Error:", error);
      throw new AppError(
        `Error deleting feedback with ID: ${id}`,
        500,
        "FEEDBACK_DB_DELETE_ERROR"
      );
    }
  }
}