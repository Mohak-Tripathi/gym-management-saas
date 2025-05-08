import { Request, Response } from "express";
import { TrainerService } from "../services/trainer.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";
import { prisma } from "../database/prisma";

export const TrainerController = {
  // async create(req: Request, res: Response) {
  //   try {
  //     // const gymId = req.user?.gymId;
  //     const { gymId, gymBranchId } = req.user!;
  //     if (!gymId || !gymBranchId) {
  //       throw new Error("Gym ID or Gymbranchid is required");
  //     }
  //     //const trainer = await TrainerService.onBoardTrainer({ ...req.body, gymId, gymBranchId });
  //      // Destructure the incoming request body
  //   const { userData, trainerData } = req.body;

  //   // Add gymId and gymBranchId to userData since User table needs these fields
  //   const enrichedData = {
  //     userData: { ...userData, gymId, gymBranchId },
  //     trainerData: { ...trainerData, gymId, gymBranchId }
  //   };

  //   console.log(enrichedData, "enrichedData")

  //   const trainer = await TrainerService.onBoardTrainer(enrichedData);

  //     res.status(201).json({
  //       status: "success",
  //       data: trainer
  //     });
  //   } catch (err) {
  //     handleErrorResponse(res, err);
  //   }
  // },

  async create(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }

      // Get gymBranchId from request body instead of user context
      const { userData, trainerData } = req.body;

      if (!trainerData.gymBranchId) {
        throw new Error("Gym Branch ID is required in trainer data");
      }

      const enrichedData = {
        userData: {
          ...userData,
          gymId,
          gymBranchId: trainerData.gymBranchId, // Use branch ID from request
        },
        trainerData: {
          ...trainerData,
          gymId,
          // gymBranchId already exists in trainerData
        },
      };

      console.log("Enriched data:", enrichedData); // For debugging

      const trainer = await TrainerService.onBoardTrainer(enrichedData);
      res.status(201).json({
        status: "success",
        data: trainer,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const trainers = await TrainerService.getAllTrainers(gymId, gymBranchId);
      res.status(200).json({
        status: "success",
        data: trainers,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;
      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const trainer = await TrainerService.getTrainerById(
        id,
        gymId,
        gymBranchId
      );
      if (!trainer) {
        res.status(404).json({
          message: "Trianer not found",
          code: "TRAINER_NOT_FOUND",
        });
        return;
      }
      res.status(200).json({
        status: "success",
        data: trainer,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  // async update(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     // If using query parameter approach
  //     const gymBranchId = req.query.gymBranchId as string;

  //     const data = req.body;
  //     const { gymId } = req.user!;

  //     if (!gymId || !gymBranchId) {
  //       throw new Error("Gym ID and Branch ID are required");
  //     }
  //     const trainer = await TrainerService.updateTrainer(
  //       id,
  //       data,
  //       gymId,
  //       gymBranchId
  //     );
  //     res.status(200).json({
  //       status: "success",
  //       data: trainer,
  //     });
  //   } catch (err) {
  //     handleErrorResponse(res, err);
  //   }
  // },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userData, trainerData } = req.body;
      const { gymId } = req.user!;
      const gymBranchId = req.query.gymBranchId as string;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const enrichedData = {
        userData: userData ? { ...userData, gymId, gymBranchId } : undefined,
        trainerData: trainerData
          ? { ...trainerData, gymId, gymBranchId }
          : undefined,
      };

      const trainer = await TrainerService.updateTrainer(
        id,
        enrichedData,
        gymId,
        gymBranchId
      );

      res.status(200).json({
        status: "success",
        data: trainer,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }
      const result = await TrainerService.deleteTrainer(id, gymId, gymBranchId);
      res.status(200).json({
        status: "success",
        result,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },
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
