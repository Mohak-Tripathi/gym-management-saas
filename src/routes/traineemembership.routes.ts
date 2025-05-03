import { Router } from "express";
import { TraineeMembershipController } from "../controllers/traineemembership.controller";

import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware); // 


// router.post("/", TraineeMembershipController.create);
router.get("/", authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TraineeMembershipController.getAll);
router.get("/:id", authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TraineeMembershipController.getById);
router.put("/:id",authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TraineeMembershipController.update);
router.delete("/:id",authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TraineeMembershipController.delete);

export default router;
