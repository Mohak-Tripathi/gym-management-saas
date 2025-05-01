"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeMembershipService = void 0;
const traineemembership_database_1 = require("../database/traineemembership.database");
const AppError_1 = require("../utils/AppError");
class TraineeMembershipService {
    //   static async createTraineeMembership(data: any) {
    //     try {
    //       return await TraineeMembershipDatabase.create(data);
    //     } catch (error) {
    //       if (error instanceof AppError) {
    //         throw error;
    //       }
    //       throw new AppError(
    //         "Service error while creating trainee membership",
    //         500,
    //         "TRAINEE_MEMBERSHIP_SERVICE_CREATE_ERROR"
    //       );
    //     }
    //   }
    static async getAllTraineeMemberships() {
        try {
            return await traineemembership_database_1.TraineeMembershipDatabase.getAll();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Service error while fetching all trainee memberships", 500, "TRAINEE_MEMBERSHIP_SERVICE_GET_ALL_ERROR");
        }
    }
    static async getTraineeMembershipById(id) {
        try {
            return await traineemembership_database_1.TraineeMembershipDatabase.getById(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Service error while fetching trainee membership with ID: ${id}`, 500, "TRAINEE_MEMBERSHIP_SERVICE_GET_BY_ID_ERROR");
        }
    }
    static async updateTraineeMembership(id, data) {
        try {
            return await traineemembership_database_1.TraineeMembershipDatabase.update(id, data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Service error while updating trainee membership with ID: ${id}`, 500, "TRAINEE_MEMBERSHIP_SERVICE_UPDATE_ERROR");
        }
    }
    static async deleteTraineeMembership(id) {
        try {
            return await traineemembership_database_1.TraineeMembershipDatabase.delete(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Service error while deleting trainee membership with ID: ${id}`, 500, "TRAINEE_MEMBERSHIP_SERVICE_DELETE_ERROR");
        }
    }
}
exports.TraineeMembershipService = TraineeMembershipService;
