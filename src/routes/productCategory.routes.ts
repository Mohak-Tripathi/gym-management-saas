import { Router } from 'express';
import { ProductCategoryController } from '../controllers/productCategory.controller';

import { authMiddleware} from '../utils/authMiddleware';
const router = Router();

// All routes are protected and require authentication

router.use(authMiddleware); 
// Product Category routes
router.post('/', ProductCategoryController.create);
router.get('/', ProductCategoryController.getAll);
router.get('/:id', ProductCategoryController.getById);
router.put('/:id', ProductCategoryController.update);
router.delete('/:id', ProductCategoryController.delete);

export default router;