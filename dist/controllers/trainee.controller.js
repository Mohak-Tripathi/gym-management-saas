"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeController = void 0;
const trainee_service_1 = require("../services/trainee.service");
const handleErrorResponse_1 = require("../utils/handleErrorResponse");
class TraineeController {
    static async create(req, res) {
        try {
            const trainee = await trainee_service_1.TraineeService.createTrainee(req.body);
            res.status(201).json({
                status: "success",
                data: trainee
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async getAll(req, res) {
        try {
            const trainees = await trainee_service_1.TraineeService.getAllTrainees();
            res.status(200).json({
                status: "success",
                data: trainees
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const trainee = await trainee_service_1.TraineeService.getTraineeById(id);
            res.status(200).json({
                status: "success",
                data: trainee
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const trainee = await trainee_service_1.TraineeService.updateTrainee(id, req.body);
            res.status(200).json({
                status: "success",
                data: trainee
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await trainee_service_1.TraineeService.deleteTrainee(id);
            res.status(204).json({
                status: "success",
                data: null
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
}
exports.TraineeController = TraineeController;
