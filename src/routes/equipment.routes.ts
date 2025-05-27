import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';


import { authMiddleware} from '../utils/authMiddleware';
import { upload } from '../middlewares/upload.middleware';
// import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware); 

router.post('/', upload.single('image'), EquipmentController.create);
// router.post('/', EquipmentController.create);
router.get('/', EquipmentController.getAll);
router.get('/:id', EquipmentController.getById);
router.put('/:id', EquipmentController.update);
router.delete('/:id', EquipmentController.delete);

export default router;
