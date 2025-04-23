import express from 'express';
import { GymController } from '../controllers/gym.controller';

const router = express.Router();

router.post('/', GymController.create);
router.get('/', GymController.getAll);
router.get('/:id', GymController.getById);
router.put('/:id', GymController.update);
router.delete('/:id', GymController.delete);

export default router;
