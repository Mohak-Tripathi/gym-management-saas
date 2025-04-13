import { Router } from "express";
import { MembershipController } from "../controllers/membership.controller";

const router = Router();

// Create a new membership
router.post("/", MembershipController.create);

// Get all memberships
router.get("/", MembershipController.getAll);

// Get a membership by ID
router.get("/:id", MembershipController.getById);

// Update a membership by ID
router.put("/:id", MembershipController.update);

// Delete a membership by ID
router.delete("/:id", MembershipController.delete);

export default router;
