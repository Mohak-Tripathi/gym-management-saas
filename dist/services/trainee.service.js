"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeService = void 0;
// ✅ Service Layer - src/services/trainee.service.ts
const trainee_database_1 = require("../database/trainee.database");
const AppError_1 = require("../utils/AppError");
class TraineeService {
    static async createTrainee(data) {
        try {
            const trainee = await trainee_database_1.TraineeDatabase.create(data);
            return trainee;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Error creating trainee", 500, "TRAINEE_SERVICE_CREATE_ERROR");
        }
    }
    static async getAllTrainees() {
        try {
            const trainees = await trainee_database_1.TraineeDatabase.getAll();
            return trainees;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Error fetching trainees", 500, "TRAINEE_SERVICE_FETCH_ALL_ERROR");
        }
    }
    static async getTraineeById(id) {
        try {
            const trainee = await trainee_database_1.TraineeDatabase.getById(id);
            if (!trainee) {
                throw new AppError_1.AppError("Trainee not found", 404, "TRAINEE_SERVICE_NOT_FOUND_ERROR");
            }
            return trainee;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error fetching trainee with ID: ${id}`, 500, "TRAINEE_SERVICE_FETCH_BY_ID_ERROR");
        }
    }
    static async updateTrainee(id, data) {
        try {
            const trainee = await trainee_database_1.TraineeDatabase.update(id, data);
            return trainee;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error updating trainee with ID: ${id}`, 500, "TRAINEE_SERVICE_UPDATE_ERROR");
        }
    }
    static async deleteTrainee(id) {
        try {
            await trainee_database_1.TraineeDatabase.delete(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error deleting trainee with ID: ${id}`, 500, "TRAINEE_SERVICE_DELETE_ERROR");
        }
    }
}
exports.TraineeService = TraineeService;
