"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeService = void 0;
// ✅ Service Layer - src/services/trainee.service.ts
const trainee_database_1 = require("../database/trainee.database");
class TraineeService {
    static async createTrainee(data) {
        return trainee_database_1.TraineeDatabase.create(data);
    }
    static async getAllTrainees() {
        return trainee_database_1.TraineeDatabase.getAll();
    }
    static async getTraineeById(id) {
        return trainee_database_1.TraineeDatabase.getById(id);
    }
    static async updateTrainee(id, data) {
        return trainee_database_1.TraineeDatabase.update(id, data);
    }
    static async deleteTrainee(id) {
        return trainee_database_1.TraineeDatabase.delete(id);
    }
}
exports.TraineeService = TraineeService;
