"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeController = void 0;
const trainee_service_1 = require("../services/trainee.service");
class TraineeController {
    static async create(req, res) {
        const trainee = await trainee_service_1.TraineeService.createTrainee(req.body);
        res.json(trainee);
    }
    static async getAll(req, res) {
        const trainees = await trainee_service_1.TraineeService.getAllTrainees();
        res.json(trainees);
    }
    static async getById(req, res) {
        const trainee = await trainee_service_1.TraineeService.getTraineeById(req.params.id);
        res.json(trainee);
    }
    static async update(req, res) {
        const updated = await trainee_service_1.TraineeService.updateTrainee(req.params.id, req.body);
        res.json(updated);
    }
    static async delete(req, res) {
        const deleted = await trainee_service_1.TraineeService.deleteTrainee(req.params.id);
        res.json(deleted);
    }
}
exports.TraineeController = TraineeController;
