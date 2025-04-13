"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeDatabase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TraineeDatabase {
    static async create(data) {
        return prisma.trainee.create({ data });
    }
    static async getAll() {
        return prisma.trainee.findMany({
            include: {
                membership: true,
                trainer: true,
            },
        });
    }
    static async getById(id) {
        return prisma.trainee.findUnique({
            where: { id },
            include: {
                membership: true,
                trainer: true,
            },
        });
    }
    static async update(id, data) {
        return prisma.trainee.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma.trainee.delete({ where: { id } });
    }
}
exports.TraineeDatabase = TraineeDatabase;
