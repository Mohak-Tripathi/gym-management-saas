"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityPostService = void 0;
const communityPost_database_1 = require("../database/communityPost.database");
const AppError_1 = require("../utils/AppError");
class CommunityPostService {
    static async create(data) {
        try {
            return await communityPost_database_1.CommunityPostDatabase.create(data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError("Error creating community post", 500, "COMMUNITY_POST_SERVICE_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            return await communityPost_database_1.CommunityPostDatabase.getAll();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError("Error fetching community posts", 500, "COMMUNITY_POST_SERVICE_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            const post = await communityPost_database_1.CommunityPostDatabase.getById(id);
            if (!post) {
                throw new AppError_1.AppError("Community post not found", 404, "COMMUNITY_POST_NOT_FOUND");
            }
            return post;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error fetching post with ID: ${id}`, 500, "COMMUNITY_POST_SERVICE_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            const post = await communityPost_database_1.CommunityPostDatabase.getById(id);
            if (!post) {
                throw new AppError_1.AppError("Community post not found", 404, "COMMUNITY_POST_NOT_FOUND");
            }
            return await communityPost_database_1.CommunityPostDatabase.update(id, data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error updating post with ID: ${id}`, 500, "COMMUNITY_POST_SERVICE_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            const post = await communityPost_database_1.CommunityPostDatabase.getById(id);
            if (!post) {
                throw new AppError_1.AppError("Community post not found", 404, "COMMUNITY_POST_NOT_FOUND");
            }
            return await communityPost_database_1.CommunityPostDatabase.delete(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error deleting post with ID: ${id}`, 500, "COMMUNITY_POST_SERVICE_DELETE_ERROR");
        }
    }
}
exports.CommunityPostService = CommunityPostService;
