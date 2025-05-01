import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class TrainerDB {
  static async create(data: any) {
    try {
      return await prisma.trainer.create({ data });
    } catch (error) {
      console.error("🔥 Trainer Create Error:", error); 
      throw new AppError(
        "Error creating trainer",
        500,
        "TRAINER_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string) {
    try {
      return await prisma.trainer.findMany({
        where: { gymId },
        include: {
          certifications: true,
          trainees: true,
          workoutPlans: true,
          trainerSalaries: true
        }
      });
    } catch (error) {
      throw new AppError(
        "Error fetching trainers",
        500,
        "TRAINER_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string) {
    try {
      const trainer = await prisma.trainer.findUnique({
        where: { id },
        include: {
          certifications: true,
          trainees: true,
          workoutPlans: true,
          trainerSalaries: true
        }
      });

      if (!trainer) {
        throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
      }

      if (trainer.gymId !== gymId) {
        throw new AppError("Unauthorized access to trainer", 403, "UNAUTHORIZED_ACCESS");
      }

      return trainer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching trainer",
        500,
        "TRAINER_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      const { gymId, ...updateData } = data;
      
      const trainer = await prisma.trainer.findUnique({
        where: { id }
      });

      if (!trainer) {
        throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
      }

      if (trainer.gymId !== gymId) {
        throw new AppError("Unauthorized access to trainer", 403, "UNAUTHORIZED_ACCESS");
      }

      return await prisma.trainer.update({
        where: { id },
        data: updateData,
        include: {
          certifications: true,
          trainees: true,
          workoutPlans: true,
          trainerSalaries: true
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error updating trainer",
        500,
        "TRAINER_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string) {
    try {
      const trainer = await prisma.trainer.findUnique({
        where: { id }
      });

      if (!trainer) {
        throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
      }

      if (trainer.gymId !== gymId) {
        throw new AppError("Unauthorized access to trainer", 403, "UNAUTHORIZED_ACCESS");
      }

      return await prisma.trainer.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error deleting trainer",
        500,
        "TRAINER_DB_DELETE_ERROR"
      );
    }
  }
}

// import { PrismaClient } from '@prisma/client';
// import { AppError } from '../utils/AppError';

// const prisma = new PrismaClient();

// export class TrainerDB {
//   static async create(data: any) {
//     try {
//       return await prisma.trainer.create({ data });
//     } catch (error) {
//       console.error("🔥 Trainer Create Error:", error); 
//       throw new AppError(
//         "Error creating trainer",
//         500,
//         "TRAINER_DB_CREATE_ERROR"
//       );
//     }
//   }

//   static async getAll() {
//     try {
//       // return await prisma.trainer.findMany();
//       return await prisma.trainer.findMany({
//         include: {
//           certifications: true,
//           trainees: true,
//           workoutPlans: true,
//           trainerSalaries: true
//         }
//       });
//     } catch (error) {
//       throw new AppError(
//         "Error fetching trainers",
//         500,
//         "TRAINER_DB_FETCH_ALL_ERROR"
//       );
//     }
//   }

//   static async getById(id: string) {
//     try {
//       // return await prisma.trainer.findUnique({ where: { id } });

//       return await prisma.trainer.findUnique({
//         where: { id },
//         include: {
//           certifications: true,
//           trainees: true,
//           workoutPlans: true,
//           trainerSalaries: true,
//         },
//       });
//     } catch (error) {
//       throw new AppError(
//         `Error fetching trainer with ID: ${id}`,
//         500,
//         "TRAINER_DB_FETCH_BY_ID_ERROR"
//       );
//     }
//   }

//   static async update(id: string, data: any) {
//     try {
//       return await prisma.trainer.update({ where: { id }, data });
//     } catch (error) {
//       throw new AppError(
//         `Error updating trainer with ID: ${id}`,
//         500,
//         "TRAINER_DB_UPDATE_ERROR"
//       );
//     }
//   }

//   static async delete(id: string) {
//     try {
//       return await prisma.trainer.delete({ where: { id } });
//     } catch (error) {
//       throw new AppError(
//         `Error deleting trainer with ID: ${id}`,
//         500,
//         "TRAINER_DB_DELETE_ERROR"
//       );
//     }
//   }
// }
