
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();


export class GymBranchDatabase {
  static async create(data: any) {
    console.log(data, "data-gymbranch-create")
    try {
      return await prisma.gymBranch.create({ data });
    } catch (error) {
      console.log(error, "errorGymBranch")
      throw new AppError(
        "Error creating gym branch",
        500,
        "GYM_BRANCH_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string) {
    try {
      return await prisma.gymBranch.findMany({
        where: { gymId },              // ✅ filter by gym
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new AppError(
        "Error fetching gym branches",
        500,
        "GYM_BRANCH_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string) {
    try {
      return await prisma.gymBranch.findUnique({
        where: { id, gymId }
      });
    } catch (error) {
      throw new AppError(
        `Error fetching gym branch with ID: ${id}`,
        500,
        "GYM_BRANCH_DB_FETCH_BY_ID_ERROR"
      );
    }
  }


  static async update(id: string, data: any, gymId: string) {
    try {
      return await prisma.gymBranch.update({
        where: { 
          id,
          gymId // Add tenant scoping
        },
        data
      });
    } catch (error) {
      throw new AppError(
        `Error updating gym branch with ID: ${id}`,
        500,
        "GYM_BRANCH_DB_UPDATE_ERROR"
      );
    }
  }



  static async delete(id: string, gymId: string) {
    try {
      return await prisma.gymBranch.delete({
        where: { 
          id,
          gymId // Add tenant scoping
        }
      });
    } catch (error) {
      throw new AppError(
        `Error deleting gym branch with ID: ${id}`,
        500,
        "GYM_BRANCH_DB_DELETE_ERROR"
      );
    }
  }

}
