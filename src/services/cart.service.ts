import { CartDatabase } from '../database/cart.database';
import { AppError } from '../utils/AppError';

export class CartService {
  static async getCart(userId: string) {
    return await CartDatabase.getCart(userId);
  }

  static async addOrUpdateItem(userId: string, gymId: string, gymBranchId: string, productId: string, quantity: number, price: number) {
    if (quantity <= 0) throw new AppError('Quantity must be positive', 400);
    return await CartDatabase.addOrUpdateItem(userId, gymId, gymBranchId, productId, quantity, price);
  }

  static async updateItemQuantity(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) throw new AppError('Quantity must be positive', 400);
    return await CartDatabase.updateItemQuantity(userId, productId, quantity);
  }

  static async removeItem(userId: string, productId: string) {
    return await CartDatabase.removeItem(userId, productId);
  }

  static async clearCart(userId: string) {
    return await CartDatabase.clearCart(userId);
  }
}