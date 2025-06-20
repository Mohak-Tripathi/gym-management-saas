import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';

import { authMiddleware} from '../utils/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', CartController.getCart);
router.post('/items', CartController.addOrUpdateItem);
router.put('/items', CartController.updateItemQuantity);
router.delete('/items', CartController.removeItem);
router.delete('/clear', CartController.clearCart);

export default router;

