
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class GymDatabase {
  static async create(data: any) {
    try {
      return await prisma.gym.create({ data });
    } catch (error) {
      throw new AppError(
        "Error creating gym",
        500,
        "GYM_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll() {
    try {
      return await prisma.gym.findMany({
        include: {
          branches: true
        },
        orderBy: { createdAt: "desc" }
      });
    } catch (error) {
      throw new AppError(
        "Error fetching gyms",
        500,
        "GYM_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.gym.findUnique({
        where: { id },
        include: {
          branches: true
        }
      });
    } catch (error) {
      throw new AppError(
        `Error fetching gym with ID: ${id}`,
        500,
        "GYM_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      return await prisma.gym.update({
        where: { id },
        data,
        include: {
          branches: true
        }
      });
    } catch (error) {
      throw new AppError(
        `Error updating gym with ID: ${id}`,
        500,
        "GYM_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.gym.delete({
        where: { id }
      });
    } catch (error) {
      throw new AppError(
        `Error deleting gym with ID: ${id}`,
        500,
        "GYM_DB_DELETE_ERROR"
      );
    }
  }
}
