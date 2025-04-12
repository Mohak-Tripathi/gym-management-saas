// src/services/trainee.service.ts
import { traineeDB } from '../database/trainee.db';

export class TraineeService {
  static async createTrainee(data: any) {
    return traineeDB.create(data);
  }

  static async getAllTrainees() {
    return traineeDB.getAll();
  }

  static async getTraineeById(id: string) {
    return traineeDB.getById(id);
  }

  static async updateTrainee(id: string, data: any) {
    return traineeDB.update(id, data);
  }

  static async deleteTrainee(id: string) {
    return traineeDB.delete(id);
  }
}