import { Router } from "express";
import { CommunityPostController } from "../controllers/communityPost.controller";
import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware); 

router.post("/", authorize(UserRole.SUPERADMIN, UserRole.ADMIN), CommunityPostController.create);
router.get("/",authorize(UserRole.SUPERADMIN, UserRole.ADMIN), CommunityPostController.getAll);
router.get("/:id",authorize(UserRole.SUPERADMIN, UserRole.ADMIN), CommunityPostController.getById);
router.put("/:id", authorize(UserRole.SUPERADMIN, UserRole.ADMIN), CommunityPostController.update);
router.delete("/:id",authorize(UserRole.SUPERADMIN, UserRole.ADMIN), CommunityPostController.delete);

export default router;
