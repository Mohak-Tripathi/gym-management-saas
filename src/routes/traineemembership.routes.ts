import { Router } from "express";
import { TraineeMembershipController } from "../controllers/traineemembership.controller";


const router = Router();

// router.post("/", TraineeMembershipController.create);
router.get("/", TraineeMembershipController.getAll);
router.get("/:id", TraineeMembershipController.getById);
router.put("/:id", TraineeMembershipController.update);
router.delete("/:id", TraineeMembershipController.delete);

export default router;
