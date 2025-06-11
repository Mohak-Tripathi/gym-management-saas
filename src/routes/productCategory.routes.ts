import { Router } from 'express';
import { ProductCategoryController } from '../controllers/productCategory.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes are protected and require authentication
router.use(authenticate);

// Product Category routes
router.post('/', ProductCategoryController.create);
router.get('/', ProductCategoryController.getAll);
router.get('/:id', ProductCategoryController.getById);
router.put('/:id', ProductCategoryController.update);
router.delete('/:id', ProductCategoryController.delete);

export default router;