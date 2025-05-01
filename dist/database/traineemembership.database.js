"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeMembershipDatabase = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
class TraineeMembershipDatabase {
    static async create(data) {
        try {
            return await prisma.traineeMembership.create({ data,
                include: {
                    trainee: true,
                    membership: true,
                },
            });
        }
        catch (error) {
            throw new AppError_1.AppError("Error creating trainee membership", 500, "TRAINEE_MEMBERSHIP_DB_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            //   return await prisma.traineeMembership.findMany();
            return await prisma.traineeMembership.findMany({
                include: {
                    trainee: true,
                    membership: true,
                },
            });
        }
        catch (error) {
            throw new AppError_1.AppError("Error fetching trainee memberships", 500, "TRAINEE_MEMBERSHIP_DB_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            //   return await prisma.traineeMembership.findUnique({ where: { id } });
            return await prisma.traineeMembership.findUnique({
                where: { id },
                include: {
                    trainee: true,
                    membership: true,
                },
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching trainee membership with ID: ${id}`, 500, "TRAINEE_MEMBERSHIP_DB_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            return await prisma.traineeMembership.update({
                where: { id },
                data,
                include: {
                    trainee: true,
                    membership: true,
                },
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error updating trainee membership with ID: ${id}`, 500, "TRAINEE_MEMBERSHIP_DB_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            return await prisma.traineeMembership.delete({ where: { id } });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error deleting trainee membership with ID: ${id}`, 500, "TRAINEE_MEMBERSHIP_DB_DELETE_ERROR");
        }
    }
}
exports.TraineeMembershipDatabase = TraineeMembershipDatabase;
