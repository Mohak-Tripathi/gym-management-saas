import { Request, Response } from "express";
import { TrainerService } from "../services/trainer.service";

export const TrainerController = {
  async create(req: Request, res: Response) {
    const trainer = await TrainerService.createTrainer(req.body);
    res.status(201).json(trainer);
  },

  async getAll(req: Request, res: Response) {
    const trainers = await TrainerService.getAllTrainers();
    res.json(trainers);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const trainer = await TrainerService.getTrainerById(id);
    if (!trainer){
        res.status(404).json({ message: "Trainer not found" });
    }else{
        res.json(trainer);
    }
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const trainer = await TrainerService.updateTrainer(id, req.body);
    res.json(trainer);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await TrainerService.deleteTrainer(id);
    res.json({ message: "Trainer deleted successfully" });
  },
};
