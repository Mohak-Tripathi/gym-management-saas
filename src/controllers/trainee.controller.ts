

// src/controllers/trainee.controller.ts
import { Request, Response } from 'express';
import { TraineeService } from '../services/trainee.service';

export class TraineeController {
  static async create(req: Request, res: Response) {
    const trainee = await TraineeService.createTrainee(req.body);
    res.json(trainee);
  }

  static async getAll(req: Request, res: Response) {
    const trainees = await TraineeService.getAllTrainees();
    res.json(trainees);
  }

  static async getById(req: Request, res: Response) {
    const trainee = await TraineeService.getTraineeById(req.params.id);
    res.json(trainee);
  }

  static async update(req: Request, res: Response) {
    const updated = await TraineeService.updateTrainee(req.params.id, req.body);
    res.json(updated);
  }

  static async delete(req: Request, res: Response) {
    const deleted = await TraineeService.deleteTrainee(req.params.id);
    res.json(deleted);
  }
}
