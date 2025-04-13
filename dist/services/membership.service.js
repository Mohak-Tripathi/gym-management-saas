"use strict";
// import { MembershipDatabase } from "../database/membership.database";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipService = void 0;
// export class MembershipService {
//   static async createMembership(data:any) {
//     return MembershipDatabase.create(data);
//   }
//   static async getAllMemberships() {
//     return MembershipDatabase.getAll();
//   }
//   static async getMembershipById(id: string) {
//     return MembershipDatabase.getById(id);
//   }
//   static async updateMembership(id: string, data:unknown) {
//     return MembershipDatabase.update(id, data);
//   }
//   static async deleteMembership(id: string) {
//     return MembershipDatabase.delete(id);
//   }
// }
const membership_database_1 = require("../database/membership.database");
const AppError_1 = require("../utils/AppError");
class MembershipService {
    static async createMembership(data) {
        try {
            return await membership_database_1.MembershipDatabase.create(data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Service error while creating membership", 500, "MEMBERSHIP_SERVICE_CREATE_ERROR");
        }
    }
    static async getAllMemberships() {
        try {
            return await membership_database_1.MembershipDatabase.getAll();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Service error while fetching all memberships", 500, "MEMBERSHIP_SERVICE_GET_ALL_ERROR");
        }
    }
    static async getMembershipById(id) {
        try {
            return await membership_database_1.MembershipDatabase.getById(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Service error while fetching membership with ID: ${id}`, 500, "MEMBERSHIP_SERVICE_GET_BY_ID_ERROR");
        }
    }
    static async updateMembership(id, data) {
        try {
            return await membership_database_1.MembershipDatabase.update(id, data);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Service error while updating membership with ID: ${id}`, 500, "MEMBERSHIP_SERVICE_UPDATE_ERROR");
        }
    }
    static async deleteMembership(id) {
        try {
            return await membership_database_1.MembershipDatabase.delete(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Service error while deleting membership with ID: ${id}`, 500, "MEMBERSHIP_SERVICE_DELETE_ERROR");
        }
    }
}
exports.MembershipService = MembershipService;
