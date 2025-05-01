"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymBranchService = void 0;
const gymBranch_repository_1 = require("../database/gymBranch.repository");
const AppError_1 = require("../utils/AppError");
class GymBranchService {
    static async create(data) {
        try {
            return await gymBranch_repository_1.GymBranchDatabase.create(data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError("Error creating gym branch", 500, "GYM_BRANCH_SERVICE_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            return await gymBranch_repository_1.GymBranchDatabase.getAll();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError("Error fetching gym branches", 500, "GYM_BRANCH_SERVICE_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            const gymBranch = await gymBranch_repository_1.GymBranchDatabase.getById(id);
            if (!gymBranch) {
                throw new AppError_1.AppError("Gym branch not found", 404, "GYM_BRANCH_NOT_FOUND_ERROR");
            }
            return gymBranch;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error fetching gym branch with ID: ${id}`, 500, "GYM_BRANCH_SERVICE_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            const existingGymBranch = await gymBranch_repository_1.GymBranchDatabase.getById(id);
            if (!existingGymBranch) {
                throw new AppError_1.AppError("Gym branch not found", 404, "GYM_BRANCH_NOT_FOUND_ERROR");
            }
            return await gymBranch_repository_1.GymBranchDatabase.update(id, data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error updating gym branch with ID: ${id}`, 500, "GYM_BRANCH_SERVICE_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            const existingGymBranch = await gymBranch_repository_1.GymBranchDatabase.getById(id);
            if (!existingGymBranch) {
                throw new AppError_1.AppError("Gym branch not found", 404, "GYM_BRANCH_NOT_FOUND_ERROR");
            }
            return await gymBranch_repository_1.GymBranchDatabase.delete(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error deleting gym branch with ID: ${id}`, 500, "GYM_BRANCH_SERVICE_DELETE_ERROR");
        }
    }
}
exports.GymBranchService = GymBranchService;
