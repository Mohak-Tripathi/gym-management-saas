"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gym_database_1 = require("../database/gym.database");
const AppError_1 = require("../utils/AppError");
class GymService {
    static async createGym(data) {
        try {
            return await gym_database_1.GymDatabase.create(data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Error creating gym', 500, 'GYM_SERVICE_CREATE_ERROR');
        }
    }
    static async getAllGyms() {
        try {
            return await gym_database_1.GymDatabase.getAll();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Error fetching gyms', 500, 'GYM_SERVICE_FETCH_ALL_ERROR');
        }
    }
    static async getGymById(id) {
        try {
            const gym = await gym_database_1.GymDatabase.getById(id);
            if (!gym) {
                throw new AppError_1.AppError('Gym not found', 404, 'GYM_NOT_FOUND');
            }
            return gym;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error fetching gym with ID: ${id}`, 500, 'GYM_SERVICE_FETCH_BY_ID_ERROR');
        }
    }
    static async updateGym(id, data) {
        try {
            const gym = await gym_database_1.GymDatabase.getById(id);
            if (!gym) {
                throw new AppError_1.AppError('Gym not found', 404, 'GYM_NOT_FOUND');
            }
            return await gym_database_1.GymDatabase.update(id, data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error updating gym with ID: ${id}`, 500, 'GYM_SERVICE_UPDATE_ERROR');
        }
    }
    static async deleteGym(id) {
        try {
            const gym = await gym_database_1.GymDatabase.getById(id);
            if (!gym) {
                throw new AppError_1.AppError('Gym not found', 404, 'GYM_NOT_FOUND');
            }
            return await gym_database_1.GymDatabase.delete(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error deleting gym with ID: ${id}`, 500, 'GYM_SERVICE_DELETE_ERROR');
        }
    }
}
exports.default = GymService;
