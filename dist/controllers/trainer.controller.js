"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerController = void 0;
const trainer_service_1 = require("../services/trainer.service");
const handleErrorResponse_1 = require("../utils/handleErrorResponse");
exports.TrainerController = {
    async create(req, res) {
        try {
            const trainer = await trainer_service_1.TrainerService.createTrainer(req.body);
            res.status(201).json({
                status: "success",
                data: trainer
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    },
    async getAll(req, res) {
        try {
            const trainers = await trainer_service_1.TrainerService.getAllTrainers();
            res.status(200).json({
                status: "success",
                data: trainers
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            const trainer = await trainer_service_1.TrainerService.getTrainerById(id);
            res.status(200).json({
                status: "success",
                data: trainer
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const trainer = await trainer_service_1.TrainerService.updateTrainer(id, req.body);
            res.status(200).json({
                status: "success",
                data: trainer
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            await trainer_service_1.TrainerService.deleteTrainer(id);
            res.status(200).json({
                status: "success",
                message: "Trainer deleted successfully"
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    },
};
