"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gymBranch_controller_1 = require("../controllers/gymBranch.controller");
const router = express_1.default.Router();
router.post('/', gymBranch_controller_1.GymBranchController.create);
router.get('/', gymBranch_controller_1.GymBranchController.getAll);
router.get('/:id', gymBranch_controller_1.GymBranchController.getById);
router.put('/:id', gymBranch_controller_1.GymBranchController.update);
router.delete('/:id', gymBranch_controller_1.GymBranchController.delete);
exports.default = router;
