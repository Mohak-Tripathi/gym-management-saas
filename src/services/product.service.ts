import { ProductDatabase } from '../database/product.database';
import { AppError } from '../utils/AppError';

export class ProductService {
  static async create(data: any, files?: Express.Multer.File[]) {
    try {
      // Validate required fields
      if (!data.name || !data.price || !data.stockQuantity || !data.categoryId) {
        throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
      }

      // Validate price and stock
      if (parseFloat(data.price) <= 0) {
        throw new AppError('Price must be greater than 0', 400, 'INVALID_PRICE');
      }

      if (parseInt(data.stockQuantity) < 0) {
        throw new AppError('Stock quantity cannot be negative', 400, 'INVALID_STOCK');
      }

      // Validate discounted price if provided
      if (data.discountedPrice && parseFloat(data.discountedPrice) >= parseFloat(data.price)) {
        throw new AppError('Discounted price must be less than regular price', 400, 'INVALID_DISCOUNT');
      }

      return await ProductDatabase.create(data, files);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating product', 500, 'PRODUCT_SERVICE_CREATE_ERROR');
    }
  }

  static async getAll(gymId: string, gymBranchId: string, filters?: any) {
    try {
      if (!gymId) {
        throw new AppError('Gym ID is required', 400, 'INVALID_INPUT');
      }

      return await ProductDatabase.getAll(gymId, gymBranchId, filters);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching products', 500, 'PRODUCT_SERVICE_FETCH_ALL_ERROR');
    }
  }

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      if (!gymId) {
        throw new AppError('Gym ID is required', 400, 'INVALID_INPUT');
      }

      const product = await ProductDatabase.getById(id, gymId, gymBranchId);
      if (!product) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }
      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error fetching product with ID: ${id}`, 500, 'PRODUCT_SERVICE_FETCH_ERROR');
    }
  }

  static async update(id: string, data: any, gymId: string, gymBranchId: string,  files?: Express.Multer.File[]) {
    try {
      if (!gymId) {
        throw new AppError('Gym ID is required', 400, 'INVALID_INPUT');
      }

      // Validate price if provided
      if (data.price && parseFloat(data.price) <= 0) {
        throw new AppError('Price must be greater than 0', 400, 'INVALID_PRICE');
      }

      // Validate stock if provided
      if (data.stockQuantity && parseInt(data.stockQuantity) < 0) {
        throw new AppError('Stock quantity cannot be negative', 400, 'INVALID_STOCK');
      }

      // Validate discounted price if provided
      if (data.discountedPrice && data.price && 
          parseFloat(data.discountedPrice) >= parseFloat(data.price)) {
        throw new AppError('Discounted price must be less than regular price', 400, 'INVALID_DISCOUNT');
      }

      return await ProductDatabase.update(id, data,  gymId, gymBranchId, files);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error updating product with ID: ${id}`, 500, 'PRODUCT_SERVICE_UPDATE_ERROR');
    }
  }

  static async delete(id: string, gymId: string, gymBranchId: string) {
    try {
      if (!gymId) {
        throw new AppError('Gym ID is required', 400, 'INVALID_INPUT');
      }

      return await ProductDatabase.delete(id, gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error deleting product with ID: ${id}`, 500, 'PRODUCT_SERVICE_DELETE_ERROR');
    }
  }

  static async updateStock(id: string, quantity: number, gymId: string, gymBranchId: string) {
    try {
      if (!gymId) {
        throw new AppError('Gym ID is required', 400, 'INVALID_INPUT');
      }

      return await ProductDatabase.updateStock(id, quantity, gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error updating product stock`, 500, 'PRODUCT_SERVICE_STOCK_UPDATE_ERROR');
    }
  }
}