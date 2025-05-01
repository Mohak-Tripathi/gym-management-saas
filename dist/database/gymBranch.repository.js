"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymBranchDatabase = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
class GymBranchDatabase {
    static async create(data) {
        try {
            return await prisma.gymBranch.create({ data });
        }
        catch (error) {
            throw new AppError_1.AppError("Error creating gym branch", 500, "GYM_BRANCH_DB_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            return await prisma.gymBranch.findMany({
                orderBy: { createdAt: "desc" }
            });
        }
        catch (error) {
            throw new AppError_1.AppError("Error fetching gym branches", 500, "GYM_BRANCH_DB_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            return await prisma.gymBranch.findUnique({
                where: { id }
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching gym branch with ID: ${id}`, 500, "GYM_BRANCH_DB_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            return await prisma.gymBranch.update({
                where: { id },
                data
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error updating gym branch with ID: ${id}`, 500, "GYM_BRANCH_DB_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            return await prisma.gymBranch.delete({
                where: { id }
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error deleting gym branch with ID: ${id}`, 500, "GYM_BRANCH_DB_DELETE_ERROR");
        }
    }
}
exports.GymBranchDatabase = GymBranchDatabase;
