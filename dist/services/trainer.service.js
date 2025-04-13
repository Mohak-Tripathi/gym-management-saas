"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerService = void 0;
const trainer_database_1 = require("../database/trainer.database");
const AppError_1 = require("../utils/AppError");
class TrainerService {
    static async createTrainer(data) {
        try {
            const trainer = await trainer_database_1.TrainerDB.create(data);
            return trainer;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Error creating trainer", 500, "TRAINER_SERVICE_CREATE_ERROR");
        }
    }
    static async getAllTrainers() {
        try {
            const trainers = await trainer_database_1.TrainerDB.getAll();
            return trainers;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Error fetching trainers", 500, "TRAINER_SERVICE_FETCH_ALL_ERROR");
        }
    }
    static async getTrainerById(id) {
        try {
            const trainer = await trainer_database_1.TrainerDB.getById(id);
            if (!trainer) {
                throw new AppError_1.AppError("Trainer not found", 404, "TRAINER_SERVICE_NOT_FOUND_ERROR");
            }
            return trainer;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error fetching trainer with ID: ${id}`, 500, "TRAINER_SERVICE_FETCH_BY_ID_ERROR");
        }
    }
    static async updateTrainer(id, data) {
        try {
            const trainer = await trainer_database_1.TrainerDB.update(id, data);
            return trainer;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error updating trainer with ID: ${id}`, 500, "TRAINER_SERVICE_UPDATE_ERROR");
        }
    }
    static async deleteTrainer(id) {
        try {
            const trainer = await trainer_database_1.TrainerDB.delete(id);
            return trainer;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error deleting trainer with ID: ${id}`, 500, "TRAINER_SERVICE_DELETE_ERROR");
        }
    }
}
exports.TrainerService = TrainerService;
