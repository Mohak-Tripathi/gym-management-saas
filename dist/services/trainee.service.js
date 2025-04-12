"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeService = void 0;
// src/services/trainee.service.ts
const trainee_db_1 = require("../database/trainee.db");
class TraineeService {
    static async createTrainee(data) {
        return trainee_db_1.traineeDB.create(data);
    }
    static async getAllTrainees() {
        return trainee_db_1.traineeDB.getAll();
    }
    static async getTraineeById(id) {
        return trainee_db_1.traineeDB.getById(id);
    }
    static async updateTrainee(id, data) {
        return trainee_db_1.traineeDB.update(id, data);
    }
    static async deleteTrainee(id) {
        return trainee_db_1.traineeDB.delete(id);
    }
}
exports.TraineeService = TraineeService;
