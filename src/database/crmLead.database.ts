// import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

// const prisma = new PrismaClient();
import prisma from "../prisma"

export class CrmLeadDatabase {
  static async create(data: any) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "CRM_LEAD_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.cRMLead.create({ data });
    } catch (error) {
      console.error("CRMLead Create Error:", error);
      throw new AppError(
        "Error creating CRM Lead",
        500,
        "CRM_LEAD_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "CRM_LEAD_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.cRMLead.findMany({
        where: {
          gymId,
          gymBranchId: branchId,
        },
        include: {
          expectedMembership: true,
          gym: true,
          gymBranch: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("CRMLead Fetch All Error:", error);
      throw new AppError(
        "Error fetching CRM leads",
        500,
        "CRM_LEAD_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "CRM_LEAD_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.cRMLead.findFirst({
        where: {
          id,
          gymId,
          gymBranchId: branchId,
        },
        include: {
          expectedMembership: true,
          gym: true,
          gymBranch: true,
        },
      });
    } catch (error) {
      console.error("CRMLead GetById Error:", error);
      throw new AppError(
        `Error fetching CRM lead with ID: ${id}`,
        500,
        "CRM_LEAD_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "CRM_LEAD_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.cRMLead.update({
        where: {
          id,
          gymId: data.gymId,
          gymBranchId: data.gymBranchId,
        },
        data,
      });
    } catch (error) {
      console.error("CRMLead Update Error:", error);
      throw new AppError(
        `Error updating CRM lead with ID: ${id}`,
        500,
        "CRM_LEAD_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "CRM_LEAD_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.cRMLead.delete({
        where: {
          id,
          gymId,
          gymBranchId: branchId,
        },
      });
    } catch (error) {
      console.error("CRMLead Delete Error:", error);
      throw new AppError(
        `Error deleting CRM lead with ID: ${id}`,
        500,
        "CRM_LEAD_DB_DELETE_ERROR"
      );
    }
  }
}
