import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller';


import { authMiddleware} from '../utils/authMiddleware';


const router = Router();

router.use(authMiddleware); 


router.post('/', ComplaintController.create);
router.get('/', ComplaintController.getAll);
router.get('/:id', ComplaintController.getById);
router.put('/:id', ComplaintController.update);
router.delete('/:id', ComplaintController.delete);

export default router;
