"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDB = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TrainerDB {
    static async create(data) {
        return prisma.trainer.create({ data });
    }
    static async getAll() {
        return prisma.trainer.findMany();
    }
    static async getById(id) {
        return prisma.trainer.findUnique({ where: { id } });
    }
    static async update(id, data) {
        return prisma.trainer.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma.trainer.delete({ where: { id } });
    }
}
exports.TrainerDB = TrainerDB;
