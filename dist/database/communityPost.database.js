"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityPostDatabase = void 0;
// src/database/communityPost.database.ts
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
class CommunityPostDatabase {
    static async create(data) {
        try {
            return await prisma.communityPost.create({ data });
        }
        catch (error) {
            throw new AppError_1.AppError("Error creating community post", 500, "COMMUNITY_POST_DB_CREATE_ERROR");
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
        }
        catch (error) {
            throw new AppError_1.AppError("Error fetching community posts", 500, "COMMUNITY_POST_DB_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            return await prisma.communityPost.findUnique({
                where: { id }
                // include: {
                //   postedBy: true,
                // },
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching post with ID: ${id}`, 500, "COMMUNITY_POST_DB_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            return await prisma.communityPost.update({
                where: { id },
                data,
                // include: {
                //   postedBy: true,
                // },
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error updating post with ID: ${id}`, 500, "COMMUNITY_POST_DB_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            return await prisma.communityPost.delete({ where: { id } });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error deleting post with ID: ${id}`, 500, "COMMUNITY_POST_DB_DELETE_ERROR");
        }
    }
}
exports.CommunityPostDatabase = CommunityPostDatabase;
