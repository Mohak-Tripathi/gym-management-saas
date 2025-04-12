import { Router } from "express";
import { MembershipController } from "../controllers/membership.controller";

const router = Router();

router.post("/", MembershipController.create);
router.get("/", MembershipController.getAll);
router.get("/:id", MembershipController.getById);
router.put("/:id", MembershipController.update);
router.delete("/:id", MembershipController.delete);

export default router;
