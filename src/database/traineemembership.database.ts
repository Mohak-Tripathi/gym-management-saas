
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class TraineeMembershipDatabase {
  static async create(data: any) {
    try {
      return await prisma.traineeMembership.create({ data, 
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

  static async getAll() {
    try {
    //   return await prisma.traineeMembership.findMany();
      return await prisma.traineeMembership.findMany({
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

  static async getById(id: string) {
    try {
    //   return await prisma.traineeMembership.findUnique({ where: { id } });
      return await prisma.traineeMembership.findUnique({
        where: { id },
        include: {
          trainee: true,
          membership: true,
        },
      });
    } catch (error) {
      throw new AppError(
        `Error fetching trainee membership with ID: ${id}`,
        500,
        "TRAINEE_MEMBERSHIP_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
    
      return await prisma.traineeMembership.update({
        where: { id },
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

  static async delete(id: string) {
    try {
      return await prisma.traineeMembership.delete({ where: { id } });
    } catch (error) {
      throw new AppError(
        `Error deleting trainee membership with ID: ${id}`,
        500,
        "TRAINEE_MEMBERSHIP_DB_DELETE_ERROR"
      );
    }
  }
}
