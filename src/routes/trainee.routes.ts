

// ✅ Routes - src/routes/trainee.routes.ts
import { Router } from "express";
import { TraineeController } from "../controllers/trainee.controller";

const router = Router();

// router.post("/", TraineeController.create);
router.post("/", TraineeController.onboard);
router.get("/", TraineeController.getAll);
router.get("/:id", TraineeController.getById);
router.put("/:id", TraineeController.update);
router.delete("/:id", TraineeController.delete);

export default router;