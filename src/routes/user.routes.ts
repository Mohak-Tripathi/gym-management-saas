import { Router } from 'express';
import UserController from '../controllers/user.controller';


const router = Router();
// router.use(authMiddleware);

// Create a new user
router.post('/', UserController.createUser);
router.post("/login", UserController.loginUser);

// Get all users
router.get('/', UserController.getAllUsers);
// Get user by ID
router.get('/:id', UserController.getUserById);
// Get user by email
router.get('/email/:email', UserController.getUserByEmail);
// Update user
router.put('/:id', UserController.updateUser);
// Delete user
router.delete('/:id', UserController.deleteUser);
export default router;









 // 🛡 All routes below require authentication

// // Only SuperAdmin can create and delete
// router.post('/', , GymBranchController.create);
// router.delete('/:id', authorize(UserRole.SUPERADMIN), GymBranchController.delete);

// // SuperAdmin and Admin can view and update
// router.get('/', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), GymBranchController.getAll);
// router.get('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), GymBranchController.getById);
// router.put('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), GymBranchController.update);


