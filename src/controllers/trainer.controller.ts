import { Request, Response } from "express";
import { TrainerService } from "../services/trainer.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";
import { prisma } from "../database/prisma";

export const TrainerController = {
  async create(req: Request, res: Response) {
    try {
      const gymId = req.user?.gymId;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      const trainer = await TrainerService.onBoardTrainer({ ...req.body, gymId });
      res.status(201).json({
        status: "success",
        data: trainer
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const gymId = req.user?.gymId;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      const trainers = await TrainerService.getAllTrainers(gymId);
      res.status(200).json({
        status: "success", 
        data: trainers
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const gymId = req.user?.gymId;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      const trainer = await TrainerService.getTrainerById(id, gymId);
      res.status(200).json({
        status: "success",
        data: trainer
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const gymId = req.user?.gymId;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      const trainer = await TrainerService.updateTrainer(id, { ...req.body, gymId });
      res.status(200).json({
        status: "success",
        data: trainer
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const gymId = req.user?.gymId;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      await TrainerService.deleteTrainer(id, gymId);
      res.status(204).json({
        status: "success",
        data: null
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
};

// import { Request, Response } from "express";
// import { TrainerService } from "../services/trainer.service";
// import { handleErrorResponse } from "../utils/handleErrorResponse";

// export const TrainerController = {
//   async create(req: Request, res: Response) {
//     try {
//       const trainer = await TrainerService.onBoardTrainer(req.body);
//       res.status(201).json({
//         status: "success",
//         data: trainer
//       });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   },

//   async getAll(req: Request, res: Response) {
//     try {
//       const trainers = await TrainerService.getAllTrainers();
//       res.status(200).json({
//         status: "success", 
//         data: trainers
//       });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   },

//   async getById(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const trainer = await TrainerService.getTrainerById(id);
//       res.status(200).json({
//         status: "success",
//         data: trainer
//       });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   },

//   async update(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const trainer = await TrainerService.updateTrainer(id, req.body);
//       res.status(200).json({
//         status: "success",
//         data: trainer
//       });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   },

//   async delete(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       await TrainerService.deleteTrainer(id);
//       res.status(200).json({
//         status: "success",
//         message: "Trainer deleted successfully"
//       });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   },
// };
