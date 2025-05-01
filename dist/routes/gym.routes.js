"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gym_controller_1 = require("../controllers/gym.controller");
const router = express_1.default.Router();
router.post('/', gym_controller_1.GymController.create);
router.get('/', gym_controller_1.GymController.getAll);
router.get('/:id', gym_controller_1.GymController.getById);
router.put('/:id', gym_controller_1.GymController.update);
router.delete('/:id', gym_controller_1.GymController.delete);
exports.default = router;
