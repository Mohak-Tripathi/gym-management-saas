"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traineeDB = void 0;
// src/database/trainee.db.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.traineeDB = {
    create: async (data) => {
        return await prisma.trainee.create({ data });
    },
    getAll: async () => {
        return await prisma.trainee.findMany();
    },
    getById: async (id) => {
        return await prisma.trainee.findUnique({ where: { id } });
    },
    update: async (id, data) => {
        return await prisma.trainee.update({ where: { id }, data });
    },
    delete: async (id) => {
        return await prisma.trainee.delete({ where: { id } });
    },
};
