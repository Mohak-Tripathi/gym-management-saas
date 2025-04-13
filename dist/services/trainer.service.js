"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerService = void 0;
const trainer_database_1 = require("../database/trainer.database");
class TrainerService {
    static async createTrainer(data) {
        return trainer_database_1.TrainerDB.create(data);
    }
    static async getAllTrainers() {
        return trainer_database_1.TrainerDB.getAll();
    }
    static async getTrainerById(id) {
        return trainer_database_1.TrainerDB.getById(id);
    }
    static async updateTrainer(id, data) {
        return trainer_database_1.TrainerDB.update(id, data);
    }
    static async deleteTrainer(id) {
        return trainer_database_1.TrainerDB.delete(id);
    }
}
exports.TrainerService = TrainerService;
