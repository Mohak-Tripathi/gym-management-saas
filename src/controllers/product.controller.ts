import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { AppError } from '../utils/AppError';

export class ProductController {
  static async create(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      const data = {
        ...req.body,
        gymId: gymId,
        gymBranchId: req.query.gymBranchId as string
      };

      const product = await ProductService.create(data, req.files as Express.Multer.File[]);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      const filters = {
        categoryId: req.query.categoryId as string,
        search: req.query.search as string
      };

      const products = await ProductService.getAll(
        gymId, 
        req.query.gymBranchId as string,
        filters
      );
      res.json(products);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      const product = await ProductService.getById(
        req.params.id,
        gymId,
        req.query.gymBranchId as string
      );
      res.json(product);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      const product = await ProductService.update(
        req.params.id,
        req.body,
        gymId,
        req.query.gymBranchId as string,
        req.files as Express.Multer.File[],
      );
      res.json(product);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      await ProductService.delete(
        req.params.id,
        gymId,
        req.query.gymBranchId as string
      );
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async updateStock(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      const { quantity } = req.body;
      if (typeof quantity !== 'number') {
        throw new AppError('Quantity must be a number', 400, 'INVALID_INPUT');
      }

      const product = await ProductService.updateStock(
        req.params.id,
        quantity,
        gymId,
        req.query.gymBranchId as string
      );
      res.json(product);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}