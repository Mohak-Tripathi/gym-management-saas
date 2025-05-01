"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_database_1 = require("../database/user.database");
const AppError_1 = require("../utils/AppError");
class UserService {
    static async createUser(data) {
        try {
            return await user_database_1.UserDatabase.create(data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Error creating user', 500, 'USER_SERVICE_CREATE_ERROR');
        }
    }
    static async getAllUsers() {
        try {
            return await user_database_1.UserDatabase.getAll();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Error fetching users', 500, 'USER_SERVICE_FETCH_ALL_ERROR');
        }
    }
    static async loginUserByEmailAndPassword(data) {
        try {
            return await user_database_1.UserDatabase.loginCurrentUser(data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Error fetching users', 500, 'USER_SERVICE_FETCH_ALL_ERROR');
        }
    }
    static async getUserById(id) {
        try {
            const user = await user_database_1.UserDatabase.getById(id);
            if (!user) {
                throw new AppError_1.AppError('User not found', 404, 'USER_NOT_FOUND');
            }
            return user;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error fetching user with ID: ${id}`, 500, 'USER_SERVICE_FETCH_BY_ID_ERROR');
        }
    }
    static async getUserByEmail(email) {
        try {
            const user = await user_database_1.UserDatabase.getByEmail(email);
            if (!user) {
                throw new AppError_1.AppError('User not found', 404, 'USER_NOT_FOUND');
            }
            return user;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error fetching user with email: ${email}`, 500, 'USER_SERVICE_FETCH_BY_EMAIL_ERROR');
        }
    }
    static async updateUser(id, data) {
        try {
            const user = await user_database_1.UserDatabase.getById(id);
            if (!user) {
                throw new AppError_1.AppError('User not found', 404, 'USER_NOT_FOUND');
            }
            return await user_database_1.UserDatabase.update(id, data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error updating user with ID: ${id}`, 500, 'USER_SERVICE_UPDATE_ERROR');
        }
    }
    static async deleteUser(id) {
        try {
            const user = await user_database_1.UserDatabase.getById(id);
            if (!user) {
                throw new AppError_1.AppError('User not found', 404, 'USER_NOT_FOUND');
            }
            return await user_database_1.UserDatabase.delete(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(`Error deleting user with ID: ${id}`, 500, 'USER_SERVICE_DELETE_ERROR');
        }
    }
}
exports.default = UserService;
