
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();


export class GymBranchDatabase {
  static async create(data: any) {
    try {
      return await prisma.gymBranch.create({ data });
    } catch (error) {
      throw new AppError(
        "Error creating gym branch",
        500,
        "GYM_BRANCH_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll() {
    try {
      return await prisma.gymBranch.findMany({
        orderBy: { createdAt: "desc" }
      });
    } catch (error) {
      throw new AppError(
        "Error fetching gym branches",
        500,
        "GYM_BRANCH_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.gymBranch.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new AppError(
        `Error fetching gym branch with ID: ${id}`,
        500,
        "GYM_BRANCH_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      return await prisma.gymBranch.update({
        where: { id },
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

  static async delete(id: string) {
    try {
      return await prisma.gymBranch.delete({
        where: { id }
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
