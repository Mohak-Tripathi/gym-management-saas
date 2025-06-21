// import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

// const prisma = new PrismaClient();
import prisma from "../prisma"

export class CartDatabase {
  // Get or create cart for user
  static async getOrCreateCart(userId: string, gymId: string, gymBranchId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, gymId, gymBranchId },
        include: { items: { include: { product: true } } }
      });
    }
    return cart;
  }

  // Add or update item in cart
  static async addOrUpdateItem(userId: string, gymId: string, gymBranchId: string, productId: string, quantity: number, price: number) {
    const cart = await this.getOrCreateCart(userId, gymId, gymBranchId);

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      // Update quantity
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity, price }
      });
    } else {
      // Add new item
      return await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity, price }
      });
    }
  }

  // Update item quantity
  static async updateItemQuantity(userId: string, productId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new AppError('Cart not found', 404);

    const item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (!item) throw new AppError('Cart item not found', 404);

    return await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity }
    });
  }

  // Remove item from cart
  static async removeItem(userId: string, productId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new AppError('Cart not found', 404);

    return await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId }
    });
  }

  // Get cart with items
  static async getCart(userId: string) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
  }

  // Clear cart
  static async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new AppError('Cart not found', 404);

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });
  }
}