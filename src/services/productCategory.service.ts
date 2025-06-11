import { ProductCategoryDatabase } from '../database/productCategory.database';
import { AppError } from '../utils/AppError';

export class ProductCategoryService {
  static async create(data: any) {
    try {
      return await ProductCategoryDatabase.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating product category', 500, 'PRODUCT_CATEGORY_SERVICE_CREATE_ERROR');
    }
  }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      return await ProductCategoryDatabase.getAll(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching product categories', 500, 'PRODUCT_CATEGORY_SERVICE_FETCH_ALL_ERROR');
    }
  }

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      const category = await ProductCategoryDatabase.getById(id, gymId, gymBranchId);
      if (!category) {
        throw new AppError('Product category not found', 404, 'PRODUCT_CATEGORY_NOT_FOUND');
      }
      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error fetching product category with ID: ${id}`, 500, 'PRODUCT_CATEGORY_SERVICE_FETCH_ERROR');
    }
  }

  static async update(id: string, data: any, gymId: string, gymBranchId: string) {
    try {
      const category = await ProductCategoryDatabase.getById(id, gymId, gymBranchId);
      if (!category) {
        throw new AppError('Product category not found', 404, 'PRODUCT_CATEGORY_NOT_FOUND');
      }
      return await ProductCategoryDatabase.update(id, data, gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error updating product category with ID: ${id}`, 500, 'PRODUCT_CATEGORY_SERVICE_UPDATE_ERROR');
    }
  }

  static async delete(id: string, gymId: string, gymBranchId: string) {
    try {
      const category = await ProductCategoryDatabase.getById(id, gymId, gymBranchId);
      if (!category) {
        throw new AppError('Product category not found', 404, 'PRODUCT_CATEGORY_NOT_FOUND');
      }
      return await ProductCategoryDatabase.delete(id, gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error deleting product category with ID: ${id}`, 500, 'PRODUCT_CATEGORY_SERVICE_DELETE_ERROR');
    }
  }
}