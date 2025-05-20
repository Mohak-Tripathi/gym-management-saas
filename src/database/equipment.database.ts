import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class EquipmentDatabase {
  static async create(data: any) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }
      
      return await  prisma.equipment.create({ data });
    } catch (error) {
      console.error("Gym Equipment Create Error:", error);
      throw new AppError(
        "Error creating Gym Equipment",
        500,
        "GYM_EQUIPMENT_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }

        return await prisma.equipment.findMany({
            where: {
              gymId,
              gymBranchId: branchId,
            },
            include: {
              gym: {
                select: {
                  id: true,
                  name: true,
                },
              },
              gymBranch: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                },
              },
              maintenanceLogs: {
                select: {
                  id: true,
                  maintenanceDate: true,
                  status: true,
                  comments: true,
                },
              },
            },
          })
          
    
    } catch (error) {
      console.error("Gym Equipment Fetch All Error:", error);
      throw new AppError(
        "Error fetching CRM leads",
        500,
        "GYM_EQUIPMENT_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.equipment.findFirst({
        where: {
          id,
          gymId,
          gymBranchId: branchId,
        },
        // include: {
        // //   gym: true,
        // //   gymBranch: true,
        // },
        include: {
            gym: {
              select: {
                id: true,
                name: true,
              },
            },
            gymBranch: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
            maintenanceLogs: {
              select: {
                id: true,
                maintenanceDate: true,
                status: true,
                comments: true,
              },
            },
          },
      });
    } catch (error) {
      console.error("CRMLead GetById Error:", error);
      throw new AppError(
        `Error fetching CRM lead with ID: ${id}`,
        500,
        "GYM_EQUIPMENT_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.equipment.update({
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
        "GYM_EQUIPMENT_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.equipment.delete({
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
        "GYM_EQUIPMENT_DB_DELETE_ERROR"
      );
    }
  }
}
