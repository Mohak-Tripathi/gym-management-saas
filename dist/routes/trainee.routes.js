"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ Routes - src/routes/trainee.routes.ts
const express_1 = require("express");
const trainee_controller_1 = require("../controllers/trainee.controller");
const router = (0, express_1.Router)();
router.post("/", trainee_controller_1.TraineeController.create);
router.get("/", trainee_controller_1.TraineeController.getAll);
router.get("/:id", trainee_controller_1.TraineeController.getById);
router.put("/:id", trainee_controller_1.TraineeController.update);
router.delete("/:id", trainee_controller_1.TraineeController.delete);
exports.default = router;
