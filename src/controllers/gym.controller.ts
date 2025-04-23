import GymService from "../services/gym.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";
import { Request, Response, RequestHandler } from "express";

export class GymController {
  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const gym = await GymService.createGym(req.body);
      res.status(201).json(gym);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const gyms = await GymService.getAllGyms();
      res.json(gyms);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const gym = await GymService.getGymById(id);
      
      if (!gym) {
        res.status(404).json({
          message: "Gym not found",
          code: "GYM_NOT_FOUND"
        });
        return;
      }

      res.json(gym);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const gym = await GymService.updateGym(id, data);
      res.json(gym);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await GymService.deleteGym(id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}




