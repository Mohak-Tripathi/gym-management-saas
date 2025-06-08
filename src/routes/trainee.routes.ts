

// ✅ Routes - src/routes/trainee.routes.ts
import { Router } from "express";
import { TraineeController } from "../controllers/trainee.controller";

import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authMiddleware); // 


// router.post("/", TraineeController.create);
router.post("/", authorize(UserRole.SUPERADMIN, UserRole.ADMIN), upload.single("image"),
TraineeController.onboard);

router.get("/",authorize(UserRole.SUPERADMIN, UserRole.ADMIN),  TraineeController.getAll);
router.get("/:id", authorize(UserRole.SUPERADMIN, UserRole.ADMIN),  TraineeController.getById);
router.put("/:id", authorize(UserRole.SUPERADMIN, UserRole.ADMIN), upload.single("image"),  TraineeController.update);
router.delete("/:id", authorize(UserRole.SUPERADMIN, UserRole.ADMIN), TraineeController.delete);
router.put("/profile/:id", authorize(UserRole.SUPERADMIN, UserRole.ADMIN),  TraineeController.updateTraineeProfile);

export default router;