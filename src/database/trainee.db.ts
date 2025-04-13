// src/database/trainee.db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const traineeDB = {
  create: async (data: any) => {
    return await prisma.trainee.create({ data });
  },

  getAll: async () => {
    return await prisma.trainee.findMany();
  },

  getById: async (id: string) => {
    return await prisma.trainee.findUnique({ where: { id } });
  },

  update: async (id: string, data: any) => {
    return await prisma.trainee.update({ where: { id }, data });
  },

  delete: async (id: string) => {
    return await prisma.trainee.delete({ where: { id } });
  },
};