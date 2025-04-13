import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TraineeDatabase {
  static async create(data: any) {
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

  static async getById(id: string) {
    return prisma.trainee.findUnique({
      where: { id },
      include: {
        membership: true,
        trainer: true,
      },
    });
  }

  static async update(id: string, data: any) {
    return prisma.trainee.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.trainee.delete({ where: { id } });
  }
}
