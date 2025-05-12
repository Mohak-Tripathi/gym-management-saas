// src/database/communityPost.database.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class CommunityPostDatabase {
  static async create(data: any) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.communityPost.create({ data });
    } catch (error) {
      throw new AppError(
        "Error creating community post",
        500,
        "COMMUNITY_POST_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, branchId: string) {
    try {

      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.communityPost.findMany({
        where: { 
          gymId,
          gymBranchId:branchId
        },
        // include: {
        //   postedBy: true,
        // },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.log(error, "getAllError")
      throw new AppError(
        "Error fetching community posts",
        500,
        "COMMUNITY_POST_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId: string) {
    try {

      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "COMMUNITY_POST_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.communityPost.findUnique({
        where: { 
          id,
          gymId,
          gymBranchId:branchId
        }
        // where: { id }
        // include: {
        //   postedBy: true,
        // },
      });
    } catch (error) {
      console.log(error, "getByIdError")
      throw new AppError(
        `Error fetching post with ID: ${id}`,
        500,
        "COMMUNITY_POST_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.communityPost.update({
        where: { 
          id,
          gymId: data.gymId,
          gymBranchId:data.gymBranchId
 
        },
        data

        // include: {
        //   postedBy: true,
        // },
      });
    } catch (error) {
      console.log(error, "getByIdUpdateError")
      throw new AppError(
        `Error updating post with ID: ${id}`,
        500,
        "COMMUNITY_POST_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, branchId: string) {
    try {

      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.communityPost.delete({
        where: { 
          id,
          gymId,
          gymBranchId: branchId
        }
        // where: { id } 
      });
    } catch (error) {
      console.log(error, "getByIdDeleteError")
      throw new AppError(
        `Error deleting post with ID: ${id}`,
        500,
        "COMMUNITY_POST_DB_DELETE_ERROR"
      );
    }
  }
}
