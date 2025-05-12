import { Router } from "express";
import { MembershipController } from "../controllers/membership.controller";

import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware); // 

// Create a new membership
router.post("/",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MembershipController.create);
// Get all memberships
router.get("/",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MembershipController.getAll);
// Get a membership by ID
router.get("/:id",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MembershipController.getById);
// Update a membership by ID
router.put("/:id",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MembershipController.update);
// Delete a membership by ID
router.delete("/:id",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MembershipController.delete);
export default router;
