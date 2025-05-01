// src/database/communityPost.database.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class CommunityPostDatabase {
  static async create(data: any) {
    try {
      return await prisma.communityPost.create({ data });
    } catch (error) {
      throw new AppError(
        "Error creating community post",
        500,
        "COMMUNITY_POST_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll() {
    try {
      return await prisma.communityPost.findMany({
        // include: {
        //   postedBy: true,
        // },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new AppError(
        "Error fetching community posts",
        500,
        "COMMUNITY_POST_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.communityPost.findUnique({
        where: { id }
        // include: {
        //   postedBy: true,
        // },
      });
    } catch (error) {
      throw new AppError(
        `Error fetching post with ID: ${id}`,
        500,
        "COMMUNITY_POST_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      return await prisma.communityPost.update({
        where: { id },
        data,
        // include: {
        //   postedBy: true,
        // },
      });
    } catch (error) {
      throw new AppError(
        `Error updating post with ID: ${id}`,
        500,
        "COMMUNITY_POST_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.communityPost.delete({ where: { id } });
    } catch (error) {
      throw new AppError(
        `Error deleting post with ID: ${id}`,
        500,
        "COMMUNITY_POST_DB_DELETE_ERROR"
      );
    }
  }
}
