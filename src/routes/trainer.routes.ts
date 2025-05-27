
import { Router } from "express";
import { TrainerController } from "../controllers/trainer.controller";

import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authMiddleware); // 



router.post("/",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), 
upload.single("image"),
TrainerController.create);
router.get("/",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TrainerController.getAll);
router.get("/:id",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TrainerController.getById);
router.put("/:id",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TrainerController.update);
router.delete("/:id",  authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TrainerController.delete);

export default router;
