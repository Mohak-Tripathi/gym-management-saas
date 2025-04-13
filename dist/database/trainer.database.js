"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDB = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
class TrainerDB {
    static async create(data) {
        try {
            return await prisma.trainer.create({ data });
        }
        catch (error) {
            throw new AppError_1.AppError("Error creating trainer", 500, "TRAINER_DB_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            return await prisma.trainer.findMany();
        }
        catch (error) {
            throw new AppError_1.AppError("Error fetching trainers", 500, "TRAINER_DB_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            return await prisma.trainer.findUnique({ where: { id } });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching trainer with ID: ${id}`, 500, "TRAINER_DB_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            return await prisma.trainer.update({ where: { id }, data });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error updating trainer with ID: ${id}`, 500, "TRAINER_DB_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            return await prisma.trainer.delete({ where: { id } });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error deleting trainer with ID: ${id}`, 500, "TRAINER_DB_DELETE_ERROR");
        }
    }
}
exports.TrainerDB = TrainerDB;
