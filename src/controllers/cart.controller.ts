import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { AppError } from '../utils/AppError';

export class CartController {
  static async getCart(req: Request, res: Response) {
    try {

        const { gymId } = req.user!;
        if (!gymId) {
          throw new Error("Gym ID is required");
        }
        // If using query parameter approach
        const gymBranchId = req.query.gymBranchId as string;


      const cart = await CartService.getCart(req.user!.id);
      res.json(cart);
    } catch (error:any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async addOrUpdateItem(req: Request, res: Response) {
    try {
      const { productId, quantity, price } = req.body;
      const { gymId, gymBranchId, id: userId } = req.user!;
      const item = await CartService.addOrUpdateItem(userId, gymId, gymBranchId, productId, quantity, price);
      res.status(201).json(item);
    } catch (error:any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async updateItemQuantity(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const item = await CartService.updateItemQuantity(req.user!.id, productId, quantity);
      res.json(item);
      } catch (error:any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async removeItem(req: Request, res: Response) {
    try {
      const { productId } = req.body;
      await CartService.removeItem(req.user!.id, productId);
      res.status(204).send();
      } catch (error:any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async clearCart(req: Request, res: Response) {
    try {
      await CartService.clearCart(req.user!.id);
      res.status(204).send();
      } catch (error:any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}