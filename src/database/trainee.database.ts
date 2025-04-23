import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class TraineeDatabase {
  static async create(data: any) {
    try {
      return await prisma.trainee.create({ data });
    } catch (error) {
      console.log(error, "error-trainee")
      throw new AppError(
        "Error creating trainee",
        500,
        "TRAINEE_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll() {
    try {
      return await prisma.trainee.findMany({
        include: {
          // membership: true,
          trainer: true,
        },
      });
    } catch (error) {
      throw new AppError(
        "Error fetching trainees",
        500,
        "TRAINEE_DB_FETCH_ALL_ERROR"
      );
    }
  }


  static async getById(id: string) {
    try {
      return await prisma.trainee.findUnique({
        where: { id },
        include: {
          // membership: true,
          trainer: true,
        },
      });
    } catch (error) {
      throw new AppError(
        `Error fetching trainee with ID: ${id}`,
        500,
        "TRAINEE_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      return await prisma.trainee.update({ where: { id }, data });
    } catch (error) {
      throw new AppError(
        `Error updating trainee with ID: ${id}`,
        500,
        "TRAINEE_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.trainee.delete({ where: { id } });
    } catch (error) {
      throw new AppError(
        `Error deleting trainee with ID: ${id}`,
        500,
        "TRAINEE_DB_DELETE_ERROR"
      );
    }
  }
}
