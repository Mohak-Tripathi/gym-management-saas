import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TrainerDB {
  static async create(data: any) {
    return prisma.trainer.create({ data });
  }

  static async getAll() {
    return prisma.trainer.findMany();
  }

  static async getById(id: string) {
    return prisma.trainer.findUnique({ where: { id } });
  }

  static async update(id: string, data: any) {
    return prisma.trainer.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.trainer.delete({ where: { id } });
  }
}
