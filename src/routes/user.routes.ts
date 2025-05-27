import { Router } from 'express';
import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';
import UserController from '../controllers/user.controller';
import { upload } from '../middlewares/upload,middleware';

const router = Router();
// router.use(authMiddleware);

router.post("/login", UserController.loginUser);
router.use(authMiddleware); // 
router.post("/:id/change-password", UserController.changePassword);
// Create a new user
// router.post('/', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), UserController.createUser);

router.post(
  '/',
  authorize(UserRole.SUPERADMIN, UserRole.ADMIN),
  upload.single('image'),
  UserController.createUser
);

// Get all users
router.get('/', authorize(UserRole.SUPERADMIN, UserRole.ADMIN),  UserController.getAllUsers);
// Get user by ID
router.get('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN),  UserController.getUserById);
// Get user by email
router.get('/email/:email', authorize(UserRole.SUPERADMIN, UserRole.ADMIN),  UserController.getUserByEmail);
// Update user
router.put('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN),  UserController.updateUser);
// Delete user
router.delete('/:id',authorize(UserRole.SUPERADMIN, UserRole.ADMIN),  UserController.deleteUser);

export default router;









 // 🛡 All routes below require authentication

// // Only SuperAdmin can create and delete
// router.post('/', , GymBranchController.create);
// router.delete('/:id', authorize(UserRole.SUPERADMIN), GymBranchController.delete);

// // SuperAdmin and Admin can view and update
// router.get('/', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), GymBranchController.getAll);
// router.get('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), GymBranchController.getById);
// router.put('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), GymBranchController.update);


