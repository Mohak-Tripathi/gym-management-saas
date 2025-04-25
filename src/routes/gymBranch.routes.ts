import express from 'express';
import { GymBranchController } from '../controllers/gymBranch.controller';

const router = express.Router();

router.post('/', GymBranchController.create);
router.get('/', GymBranchController.getAll);
router.get('/:id', GymBranchController.getById);
router.put('/:id', GymBranchController.update);
router.delete('/:id', GymBranchController.delete);

export default router;
