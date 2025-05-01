"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymDatabase = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
class GymDatabase {
    static async create(data) {
        try {
            return await prisma.gym.create({ data });
        }
        catch (error) {
            throw new AppError_1.AppError("Error creating gym", 500, "GYM_DB_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            return await prisma.gym.findMany({
                include: {
                    branches: true
                },
                orderBy: { createdAt: "desc" }
            });
        }
        catch (error) {
            throw new AppError_1.AppError("Error fetching gyms", 500, "GYM_DB_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            return await prisma.gym.findUnique({
                where: { id },
                include: {
                    branches: true
                }
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching gym with ID: ${id}`, 500, "GYM_DB_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            return await prisma.gym.update({
                where: { id },
                data,
                include: {
                    branches: true
                }
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error updating gym with ID: ${id}`, 500, "GYM_DB_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            return await prisma.gym.delete({
                where: { id }
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error deleting gym with ID: ${id}`, 500, "GYM_DB_DELETE_ERROR");
        }
    }
}
exports.GymDatabase = GymDatabase;
