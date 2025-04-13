"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const membership_controller_1 = require("../controllers/membership.controller");
const router = (0, express_1.Router)();
// Create a new membership
router.post("/", membership_controller_1.MembershipController.create);
// Get all memberships
router.get("/", membership_controller_1.MembershipController.getAll);
// Get a membership by ID
router.get("/:id", membership_controller_1.MembershipController.getById);
// Update a membership by ID
router.put("/:id", membership_controller_1.MembershipController.update);
// Delete a membership by ID
router.delete("/:id", membership_controller_1.MembershipController.delete);
exports.default = router;
