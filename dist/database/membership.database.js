"use strict";
// // import { prisma } from "@/lib/prisma";
// // import { Prisma } from "@prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipDatabase = void 0;
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// export class MembershipDatabase {
//   static async create(data: any) {
//     return prisma.membership.create({ data });
//   }
//   static async getAll() {
//     return prisma.membership.findMany();
//   }
//   static async getById(id: string) {
//     return prisma.membership.findUnique({ where: { id } });
//   }
//   static async update(id: string, data: any) {
//     return prisma.membership.update({ where: { id }, data });
//   }
//   static async delete(id: string) {
//     return prisma.membership.delete({ where: { id } });
//   }
// }
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
class MembershipDatabase {
    static async create(data) {
        try {
            return await prisma.membership.create({ data });
        }
        catch (error) {
            throw new AppError_1.AppError("Error creating membership", 500, "MEMBERSHIP_DB_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            return await prisma.membership.findMany();
        }
        catch (error) {
            throw new AppError_1.AppError("Error fetching memberships", 500, "MEMBERSHIP_DB_FETCH_ALL_ERROR");
        }
    }
    static async getById(id) {
        try {
            return await prisma.membership.findUnique({ where: { id } });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching membership with ID: ${id}`, 500, "MEMBERSHIP_DB_FETCH_BY_ID_ERROR");
        }
    }
    static async update(id, data) {
        try {
            return await prisma.membership.update({ where: { id }, data });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error updating membership with ID: ${id}`, 500, "MEMBERSHIP_DB_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            return await prisma.membership.delete({ where: { id } });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error deleting membership with ID: ${id}`, 500, "MEMBERSHIP_DB_DELETE_ERROR");
        }
    }
}
exports.MembershipDatabase = MembershipDatabase;
