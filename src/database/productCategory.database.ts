import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class ProductCategoryDatabase {
  static async create(data: any) {
    try {
      return await prisma.productCategory.create({
        data: {
          name: data.name,
          description: data.description,
          gymId: data.gymId,
          gymBranchId: data.gymBranchId,
        },
      });
    } catch (error) {
      throw new AppError('Error creating product category', 500, 'PRODUCT_CATEGORY_CREATE_ERROR');
    }
  }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      return await prisma.productCategory.findMany({
        where: {
          gymId,
          gymBranchId,
        },
        include: {
          products: true,
        },
      });
    } catch (error) {
      throw new AppError('Error fetching product categories', 500, 'PRODUCT_CATEGORY_FETCH_ALL_ERROR');
    }
  }

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      return await prisma.productCategory.findFirst({
        where: {
          id,
          gymId,
          gymBranchId,
        },
        include: {
          products: true,
        },
      });
    } catch (error) {
      throw new AppError('Error fetching product category', 500, 'PRODUCT_CATEGORY_FETCH_ERROR');
    }
  }

  static async update(id: string, data: any, gymId: string, gymBranchId: string) {
    try {
      return await prisma.productCategory.update({
        where: {
          id,
          gymId,
          gymBranchId,
        },
        data: {
          name: data.name,
          description: data.description,
        },
      });
    } catch (error) {
      throw new AppError('Error updating product category', 500, 'PRODUCT_CATEGORY_UPDATE_ERROR');
    }
  }

  static async delete(id: string, gymId: string, gymBranchId: string) {
    try {
      return await prisma.productCategory.delete({
        where: {
          id,
          gymId,
          gymBranchId,
        },
      });
    } catch (error) {
      throw new AppError('Error deleting product category', 500, 'PRODUCT_CATEGORY_DELETE_ERROR');
    }
  }
}