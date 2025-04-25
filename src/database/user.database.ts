import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class UserDatabase {
  static async create(data: any) {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      console.log(error, "error-user")
      throw new AppError(
        "Error creating user",
        500,
        "USER_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      throw new AppError(
        "Error fetching users",
        500,
        "USER_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new AppError(
        `Error fetching user with ID: ${id}`,
        500,
        "USER_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async getByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw new AppError(
        `Error fetching user with email: ${email}`,
        500,
        "USER_DB_FETCH_BY_EMAIL_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      return await prisma.user.update({ where: { id }, data });
    } catch (error) {
      throw new AppError(
        `Error updating user with ID: ${id}`,
        500,
        "USER_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new AppError(
        `Error deleting user with ID: ${id}`,
        500,
        "USER_DB_DELETE_ERROR"
      );
    }
  }
}
