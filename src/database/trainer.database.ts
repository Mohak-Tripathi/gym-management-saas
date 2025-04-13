import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class TrainerDB {
  static async create(data: any) {
    try {
      return await prisma.trainer.create({ data });
    } catch (error) {
      throw new AppError(
        "Error creating trainer",
        500,
        "TRAINER_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll() {
    try {
      return await prisma.trainer.findMany();
    } catch (error) {
      throw new AppError(
        "Error fetching trainers",
        500,
        "TRAINER_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.trainer.findUnique({ where: { id } });
    } catch (error) {
      throw new AppError(
        `Error fetching trainer with ID: ${id}`,
        500,
        "TRAINER_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      return await prisma.trainer.update({ where: { id }, data });
    } catch (error) {
      throw new AppError(
        `Error updating trainer with ID: ${id}`,
        500,
        "TRAINER_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.trainer.delete({ where: { id } });
    } catch (error) {
      throw new AppError(
        `Error deleting trainer with ID: ${id}`,
        500,
        "TRAINER_DB_DELETE_ERROR"
      );
    }
  }
}
