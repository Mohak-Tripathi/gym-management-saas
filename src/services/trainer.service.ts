import { TrainerDB } from "../database/trainer.database";

export class TrainerService {
  static async createTrainer(data: any) {
    return TrainerDB.create(data);
  }

  static async getAllTrainers() {
    return TrainerDB.getAll();
  }

  static async getTrainerById(id: string) {
    return TrainerDB.getById(id);
  }

  static async updateTrainer(id: string, data: unknown) {
    return TrainerDB.update(id, data);
  }

  static async deleteTrainer(id: string) {
    return TrainerDB.delete(id);
  }
}
