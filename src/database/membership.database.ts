// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MembershipDatabase {
  static async create(data: any) {
    return prisma.membership.create({ data });
  }

  static async getAll() {
    return prisma.membership.findMany();
  }

  static async getById(id: string) {
    return prisma.membership.findUnique({ where: { id } });
  }

  static async update(id: string, data: any) {
    return prisma.membership.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.membership.delete({ where: { id } });
  }
}
