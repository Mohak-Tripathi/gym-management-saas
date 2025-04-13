// ✅ Service Layer - src/services/trainee.service.ts
import { TraineeDatabase } from "../database/trainee.database";

export class TraineeService {
  static async createTrainee(data: any) {
    return TraineeDatabase.create(data);
  }

  static async getAllTrainees() {
    return TraineeDatabase.getAll();
  }

  static async getTraineeById(id: string) {
    return TraineeDatabase.getById(id);
  }

  static async updateTrainee(id: string, data: any) {
    return TraineeDatabase.update(id, data);
  }

  static async deleteTrainee(id: string) {
    return TraineeDatabase.delete(id);
  }
}