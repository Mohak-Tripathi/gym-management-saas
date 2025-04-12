"use strict";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipDatabase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MembershipDatabase {
    static async create(data) {
        return prisma.membership.create({ data });
    }
    static async getAll() {
        return prisma.membership.findMany();
    }
    static async getById(id) {
        return prisma.membership.findUnique({ where: { id } });
    }
    static async update(id, data) {
        return prisma.membership.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma.membership.delete({ where: { id } });
    }
}
exports.MembershipDatabase = MembershipDatabase;
