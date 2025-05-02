import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class TraineeDatabase {
  static async create(data: any) {
    try {
      return await prisma.trainee.create({ data });
    } catch (error) {
      console.log(error, "error-trainee");
      throw new AppError(
        "Error creating trainee",
        500,
        "TRAINEE_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      return await prisma.trainee.findMany({
        where: { gymId, gymBranchId },
        include: {
          // membership: true,
          trainer: true,
          user: true,
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

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      const trainee = await prisma.trainee.findUnique({
        where: {
          id,
          gymId,
          gymBranchId,
        },
        include: {
          // membership: true,
          user: true,
          trainer: true,
        },
      });

      if (!trainee) {
        throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
      }

      return trainee;
    } catch (error) {
      throw new AppError(
        `Error fetching trainee with ID: ${id}`,
        500,
        "TRAINEE_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(
    id: string,
    data: any,
    gymId: string,
    gymBranchId: string
  ) {
    try {
      // return await prisma.trainee.update({ where: { id }, data });

      const existingTrainee = await prisma.trainee.findFirst({
        where: {
          id,
          gymId,
          gymBranchId,
        },
        include: {
          user: true,
        },
      });

      if (!existingTrainee) {
        throw new AppError(
          "Trainee not found or unauthorized access",
          404,
          "TRAINER_NOT_FOUND"
        );
      }

      const updatedTrainee = await prisma.trainee.update({
        where: { id, gymId, gymBranchId }, // Just need id here since we already verified access
        data: data,
        include: {
          user: true
        },
      });

      return updatedTrainee;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        `Error updating trainee with ID: ${id}`,
        500,
        "TRAINEE_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, gymBranchId: string) {
    try {
      const trainee = await prisma.trainee.findUnique({
        where: { id },
      });

      if (!trainee) {
        throw new AppError("Trainee not found", 404, "TRAINEE_NOT_FOUND");
      }

      if (trainee.gymId !== gymId) {
        throw new AppError(
          "Unauthorized access to trainee",
          403,
          "UNAUTHORIZED_ACCESS"
        );
      }

      return await prisma.trainee.delete({
        where: { id, gymId, gymBranchId },
      });
      // return await prisma.trainee.delete({ where: { id } });
    } catch (error) {
      throw new AppError(
        `Error deleting trainee with ID: ${id}`,
        500,
        "TRAINEE_DB_DELETE_ERROR"
      );
    }
  }
}
