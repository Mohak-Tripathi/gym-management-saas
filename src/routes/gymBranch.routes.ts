import express from 'express';
import { GymBranchController } from '../controllers/gymBranch.controller';
import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.use(authMiddleware); // 🛡 All routes below require authentication

// Only SuperAdmin can create and delete
router.post('/', authorize(UserRole.SUPERADMIN), GymBranchController.create);
router.delete('/:id', authorize(UserRole.SUPERADMIN), GymBranchController.delete);

// SuperAdmin and Admin can view and update
router.get('/', authorize(UserRole.SUPERADMIN), GymBranchController.getAll);
router.get('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), GymBranchController.getById);
router.put('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), GymBranchController.update);



// router.post('/', GymBranchController.create);
// router.get('/', GymBranchController.getAll);
// router.get('/:id', GymBranchController.getById);
// router.put('/:id', GymBranchController.update);
// router.delete('/:id', GymBranchController.delete);

export default router;
