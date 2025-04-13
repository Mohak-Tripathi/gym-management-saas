"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeDatabase = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
class TraineeDatabase {
    static async create(data) {
        try {
            return await prisma.trainee.create({ data });
        }
        catch (error) {
            throw new AppError_1.AppError("Error creating trainee", 500, "TRAINEE_DB_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            return await prisma.trainee.findMany({
                include: {
                    membership: true,
                    trainer: true,
                },
            });
        }
        catch (error) {
            throw new AppError_1.AppError("Error fetching trainees", 500, "TRAINEE_DB_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            return await prisma.trainee.findUnique({
                where: { id },
                include: {
                    membership: true,
                    trainer: true,
                },
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching trainee with ID: ${id}`, 500, "TRAINEE_DB_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            return await prisma.trainee.update({ where: { id }, data });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error updating trainee with ID: ${id}`, 500, "TRAINEE_DB_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            return await prisma.trainee.delete({ where: { id } });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error deleting trainee with ID: ${id}`, 500, "TRAINEE_DB_DELETE_ERROR");
        }
    }
}
exports.TraineeDatabase = TraineeDatabase;
