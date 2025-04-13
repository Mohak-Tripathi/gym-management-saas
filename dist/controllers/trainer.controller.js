"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerController = void 0;
const trainer_service_1 = require("../services/trainer.service");
exports.TrainerController = {
    async create(req, res) {
        const trainer = await trainer_service_1.TrainerService.createTrainer(req.body);
        res.status(201).json(trainer);
    },
    async getAll(req, res) {
        const trainers = await trainer_service_1.TrainerService.getAllTrainers();
        res.json(trainers);
    },
    async getById(req, res) {
        const { id } = req.params;
        const trainer = await trainer_service_1.TrainerService.getTrainerById(id);
        if (!trainer) {
            res.status(404).json({ message: "Trainer not found" });
        }
        else {
            res.json(trainer);
        }
    },
    async update(req, res) {
        const { id } = req.params;
        const trainer = await trainer_service_1.TrainerService.updateTrainer(id, req.body);
        res.json(trainer);
    },
    async delete(req, res) {
        const { id } = req.params;
        await trainer_service_1.TrainerService.deleteTrainer(id);
        res.json({ message: "Trainer deleted successfully" });
    },
};
