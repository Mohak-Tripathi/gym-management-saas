import { Request, Response } from 'express';
import { ProductCategoryService } from '../services/productCategory.service';
import { AppError } from '../utils/AppError';

export class ProductCategoryController {
  static async create(req: Request, res: Response) {
    try {

        const { gymId } = req.user!;
        if (!gymId) {
          throw new Error("Gym ID is required");
        }


      const data = {
        ...req.body,
        gymId: gymId
      };
      const category = await ProductCategoryService.create(data);
      res.status(201).json(category);
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
        // If using query parameter approach
        const gymBranchId = req.query.gymBranchId as string;

      const categories = await ProductCategoryService.getAll(gymId, gymBranchId);
      res.json(categories);
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
        // If using query parameter approach
        const gymBranchId = req.query.gymBranchId as string;

      const category = await ProductCategoryService.getById(
        req.params.id,
        gymId,
        gymBranchId
      );
      res.json(category);
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
        // If using query parameter approach
        const gymBranchId = req.query.gymBranchId as string;

      const category = await ProductCategoryService.update(
        req.params.id,
        req.body,
        gymId,
        gymBranchId
      );
      res.json(category);
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
        // If using query parameter approach
        const gymBranchId = req.query.gymBranchId as string;

      await ProductCategoryService.delete(
        req.params.id,
        gymId,
        gymBranchId
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
}