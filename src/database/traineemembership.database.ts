import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class TraineeMembershipDatabase {
  static async create(data: any) {
    try {
      return await prisma.traineeMembership.create({
        data,
        include: {
          trainee: true,
          membership: true,
        },
      });
    } catch (error) {
      throw new AppError(
        "Error creating trainee membership",
        500,
        "TRAINEE_MEMBERSHIP_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      //   return await prisma.traineeMembership.findMany();
      return await prisma.traineeMembership.findMany({
        where: { gymId, gymBranchId },
        include: {
          trainee: true,
          membership: true,
        },
      });
    } catch (error) {
      throw new AppError(
        "Error fetching trainee memberships",
        500,
        "TRAINEE_MEMBERSHIP_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      //   return await prisma.traineeMembership.findUnique({ where: { id } });
      const traineeMembership = await prisma.traineeMembership.findUnique({
        where: {
          id,
          gymId,
          gymBranchId,
        },
        include: {
          trainee: true,
          membership: true,
        },
      });

      if (!traineeMembership) {
        throw new AppError(
          "TraineeMembership not found",
          404,
          "TRAINEE_MEMBERSHIP_NOT_FOUND"
        );
      }
      return traineeMembership;
    } catch (error) {
      throw new AppError(
        `Error fetching trainee membership with ID: ${id}`,
        500,
        "TRAINEE_MEMBERSHIP_DB_FETCH_BY_ID_ERROR"
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
      const existingTraineeMembership =
        await prisma.traineeMembership.findFirst({
          where: {
            id,
            gymId,
            gymBranchId,
          },
        });

      if (!existingTraineeMembership) {
        throw new AppError(
          "TraineeMembership not found or unauthorized access",
          404,
          "TRAINEE_MEMBERSHIP_NOT_FOUND"
        );
      }

      return await prisma.traineeMembership.update({
        where: {
          id,
          // gymId,
          // gymBranchId,
        },
        data,
        include: {
          trainee: true,
          membership: true,
        },
      });
    } catch (error) {
      throw new AppError(
        `Error updating trainee membership with ID: ${id}`,
        500,
        "TRAINEE_MEMBERSHIP_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, gymBranchId: string) {
    try {

      // Optimisation tip => use only id as it is primary key so fater queryObjects, then check gymid of that record for authentication
      const existingTraineeMembership =
        await prisma.traineeMembership.findFirst({
          where: {
            id,
            gymId,
            gymBranchId,
          },
        });

      if (!existingTraineeMembership) {
        throw new AppError(
          "TraineeMembership not found or unauthorized access",
          404,
          "TRAINER_MEMBERSHIP_NOT_FOUND"
        );
      }

      return await prisma.traineeMembership.delete({
        where: { id},
      });
    } catch (error) {
      throw new AppError(
        `Error deleting trainee membership with ID: ${id}`,
        500,
        "TRAINEE_MEMBERSHIP_DB_DELETE_ERROR"
      );
    }
  }
}
