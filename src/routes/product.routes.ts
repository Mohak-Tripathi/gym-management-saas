import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

import { authMiddleware } from '../utils/authMiddleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// All routes are protected and require authentication
router.use(authMiddleware);

// Product routes
router.post('/', upload.array('images', 5), ProductController.create);
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.put('/:id', upload.array('images', 5), ProductController.update);
router.delete('/:id', ProductController.delete);
router.patch('/:id/stock', ProductController.updateStock);

export default router;