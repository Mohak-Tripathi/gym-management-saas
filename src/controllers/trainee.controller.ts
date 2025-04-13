// ✅ Controller Layer - src/controllers/trainee.controller.ts
import { Request, Response } from "express";
import { TraineeService } from "../services/trainee.service";

export class TraineeController {
  static async create(req: Request, res: Response) {
    const trainee = await TraineeService.createTrainee(req.body);
    res.status(201).json(trainee);
  }

  static async getAll(req: Request, res: Response) {
    const trainees = await TraineeService.getAllTrainees();
    res.status(200).json(trainees);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const trainee = await TraineeService.getTraineeById(id);
    res.status(200).json(trainee);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const trainee = await TraineeService.updateTrainee(id, req.body);
    res.status(200).json(trainee);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await TraineeService.deleteTrainee(id);
    res.status(204).send();
  }
}