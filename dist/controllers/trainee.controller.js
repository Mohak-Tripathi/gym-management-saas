"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeController = void 0;
const trainee_service_1 = require("../services/trainee.service");
class TraineeController {
    static async create(req, res) {
        const trainee = await trainee_service_1.TraineeService.createTrainee(req.body);
        res.status(201).json(trainee);
    }
    static async getAll(req, res) {
        const trainees = await trainee_service_1.TraineeService.getAllTrainees();
        res.status(200).json(trainees);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const trainee = await trainee_service_1.TraineeService.getTraineeById(id);
        res.status(200).json(trainee);
    }
    static async update(req, res) {
        const { id } = req.params;
        const trainee = await trainee_service_1.TraineeService.updateTrainee(id, req.body);
        res.status(200).json(trainee);
    }
    static async delete(req, res) {
        const { id } = req.params;
        await trainee_service_1.TraineeService.deleteTrainee(id);
        res.status(204).send();
    }
}
exports.TraineeController = TraineeController;
