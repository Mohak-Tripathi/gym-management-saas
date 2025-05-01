"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymController = void 0;
const gym_service_1 = __importDefault(require("../services/gym.service"));
const handleErrorResponse_1 = require("../utils/handleErrorResponse");
class GymController {
}
exports.GymController = GymController;
_a = GymController;
GymController.create = async (req, res) => {
    try {
        const gym = await gym_service_1.default.createGym(req.body);
        res.status(201).json(gym);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
GymController.getAll = async (req, res) => {
    try {
        const gyms = await gym_service_1.default.getAllGyms();
        res.json(gyms);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
GymController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const gym = await gym_service_1.default.getGymById(id);
        if (!gym) {
            res.status(404).json({
                message: "Gym not found",
                code: "GYM_NOT_FOUND"
            });
            return;
        }
        res.json(gym);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
GymController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const gym = await gym_service_1.default.updateGym(id, data);
        res.json(gym);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
GymController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await gym_service_1.default.deleteGym(id);
        res.json({ message: "Deleted successfully" });
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
