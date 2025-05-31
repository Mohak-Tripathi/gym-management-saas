import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { getPresignedImageUrl } from "../utils/getPresignedImageUrl";
import { deleteImageFromS3, uploadImageToS3 } from "../utils/s3";

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

  // static async getAll(gymId: string, gymBranchId: string) {
  //   try {
  //     return await prisma.trainer.findMany({
  //       where: { gymId, gymBranchId },
  //       include: {
  //         user: true,
  //         certifications: true,
  //         trainees: true,
  //         workoutPlans: true,
  //         trainerSalaries: true,
  //       },
  //     });
  //   } catch (error) {
  //     throw new AppError(
  //       "Error fetching trainers",
  //       500,
  //       "TRAINER_DB_FETCH_ALL_ERROR"
  //     );
  //   }
  // }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      if (!gymId || !gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "TRAINER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
        );
      }

      const trainers = await prisma.trainer.findMany({
        where: { gymId, gymBranchId },
        include: {
          user: true,
          certifications: true,
          trainees: true,
          workoutPlans: true,
          trainerSalaries: true,
        },
        orderBy: {
          updatedAt: 'desc', // Most recently updated or created at top
        },
      });

      // Add signed image URLs
      const processedTrainees = await Promise.all(
        trainers.map(async (trainer) => {
          const signedImageUrl = await getPresignedImageUrl(
            trainer.user?.imageUrl
          );

          return {
            ...trainer,
            imageUrl: signedImageUrl, // Exposed at top level
          };
        })
      );

      return processedTrainees;
    } catch (error) {
      throw new AppError(
        "Error fetching trainees",
        500,
        "TRAINEE_DB_FETCH_ALL_ERROR"
      );
    }
  }

  // static async getById(id: string, gymId: string, gymBranchId: string) {
  //   try {
  //     const trainer = await prisma.trainer.findFirst({
  //       // or findUnique with compound where
  //       where: {
  //         id,
  //         gymId,
  //         gymBranchId,
  //       },
  //       include: {
  //         certifications: true,
  //         user: true,
  //         trainees: true,
  //         workoutPlans: true,
  //         trainerSalaries: true,
  //       },
  //     });

  //     if (!trainer) {
  //       throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
  //     }

  //     return trainer;
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  //     throw new AppError(
  //       "Error fetching trainer",
  //       500,
  //       "TRAINER_DB_FETCH_BY_ID_ERROR"
  //     );
  //   }
  // }

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      const trainer = await prisma.trainer.findFirst({
        where: {
          id,
          gymId,
          gymBranchId,
        },
        include: {
          certifications: true,
          user: true,
          trainees: true,
          workoutPlans: true,
          trainerSalaries: true,
        },
      });

      if (!trainer) {
        throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
      }

      // Generate signed image URL if exists
      const signedImageUrl = await getPresignedImageUrl(trainer.user?.imageUrl);

      return {
        ...trainer,
        imageUrl: signedImageUrl, // Expose at top level
      };
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

  // static async update(
  //   id: string,
  //   data: any,
  //   gymId: string,
  //   gymBranchId: string
  // ) {
  //   try {
  //     const existingTrainer = await prisma.trainer.findFirst({
  //       where: {
  //         id,
  //         gymId,
  //         gymBranchId,
  //       },
  //       include: {
  //         user: true,
  //         trainees: true,
  //       },
  //     });

  //     if (!existingTrainer) {
  //       throw new AppError(
  //         "Trainer not found or unauthorized access",
  //         404,
  //         "TRAINER_NOT_FOUND"
  //       );
  //     }

  //     const updatedTrainer = await prisma.trainer.update({
  //       where: { id }, // Just need id here since we already verified access
  //       data: data,
  //       include: {
  //         user: true,
  //         certifications: true,
  //         trainees: true,
  //         workoutPlans: true,
  //         trainerSalaries: true,
  //       },
  //     });

  //     return updatedTrainer;
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  //     throw new AppError(
  //       "Error updating trainer",
  //       500,
  //       "TRAINER_DB_UPDATE_ERROR"
  //     );
  //   }
  // }

  // static async update(
  //   id: string,
  //   data: any,
  //   gymId: string,
  //   gymBranchId: string
  // ) {
  //   const { userData, trainerData } = data;

  //   try {
  //     console.log(userData, trainerData, gymId, gymBranchId, "helo");
  //     return await prisma.$transaction(async (tx) => {
  //       const existingTrainer = await tx.trainer.findFirst({
  //         where: {
  //           id,
  //         },
  //         include: {
  //           user: true,
  //         },
  //       });

  //       console.log(existingTrainer, "existing trainer");
  //       if (!existingTrainer) {
  //         throw new AppError(
  //           "Trainer not found or unauthorized access",
  //           404,
  //           "TRAINER_NOT_FOUND"
  //         );
  //       }

  //       // 1. Update User (only if userData exists)
  //       if (userData) {
  //         await tx.user.update({
  //           where: { id: existingTrainer.userId },
  //           data: userData,
  //         });
  //       }

  //       // 2. Update Trainer
  //       const updatedTrainer = await tx.trainer.update({
  //         where: { id },
  //         data: trainerData,
  //         include: {
  //           user: true,
  //           certifications: true,
  //           trainees: true,
  //           workoutPlans: true,
  //           trainerSalaries: true,
  //         },
  //       });

  //       return updatedTrainer;
  //     });
  //   } catch (error) {
  //     if (error instanceof AppError) throw error;

  //     throw new AppError(
  //       "Error updating trainer and user",
  //       500,
  //       "TRAINER_DB_UPDATE_ERROR"
  //     );
  //   }
  // }

  static async update(
    id: string,
    data: any,
    gymId: string,
    gymBranchId: string,
    file?: Express.Multer.File
  ) {

    if (!gymId || !gymBranchId) {
      throw new AppError(
        "Gym ID and Branch ID are required",
        400,
        "TRAINER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
      );
    } 
    const { userData, trainerData } = data;
  
    try {
      return await prisma.$transaction(async (tx) => {
        const existingTrainer = await tx.trainer.findFirst({
          where: {
            id,
          },
          include: {
            user: true,
          },
        });
  
        if (!existingTrainer) {
          throw new AppError(
            "Trainer not found or unauthorized access",
            404,
            "TRAINER_NOT_FOUND"
          );
        }
  
        // 1. Handle image update if file is provided
        if (file && userData) {
          const existingUser = existingTrainer.user;
  
          if (existingUser.imageUrl) {
            await deleteImageFromS3(existingUser.imageUrl);
          }
  
          const { key, name: originalName, mime } = await uploadImageToS3(
            file,
            "user-profile-images"
          );
  
          userData.imageUrl = key;
          userData.imageName = originalName;
          userData.mimeType = mime;
        }
  
        // 2. Update User (only if userData exists)
        if (userData) {
          await tx.user.update({
            where: { id: existingTrainer.userId },
            data: userData,
          });
        }
  
        // 3. Update Trainer
        const updatedTrainer = await tx.trainer.update({
          where: { id },
          data: trainerData,
          include: {
            user: true,
            certifications: true,
            trainees: true,
            workoutPlans: true,
            trainerSalaries: true,
          },
        });
  
        return updatedTrainer;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
  
      throw new AppError(
        "Error updating trainer and user",
        500,
        "TRAINER_DB_UPDATE_ERROR"
      );
    }
  }

  // static async update(
  //   id: string,
  //   data: any,
  //   gymId: string,
  //   gymBranchId: string,
  //   file?: Express.Multer.File
  // ) {
  //   const { userData, traineeData, traineeMembershipData } = data;
  
  //   try {
  //     return await prisma.$transaction(async (tx) => {
  //       const existingTrainee = await tx.trainee.findFirst({
  //         where: { id },
  //         include: {
  //           user: true,
  //           traineeMemberships: true,
  //         },
  //       });
  
  //       if (!existingTrainee) {
  //         throw new AppError("Trainee not found", 404, "TRAINEE_NOT_FOUND");
  //       }
  
  //       if (
  //         existingTrainee.gymId !== gymId ||
  //         existingTrainee.gymBranchId !== gymBranchId
  //       ) {
  //         throw new AppError("Unauthorized access", 403, "UNAUTHORIZED_ACCESS");
  //       }
  
  //       // 1. Handle image update if file is provided
  //       if (file && userData) {
  //         const existingUser = existingTrainee.user;
  
  //         // Delete old image if exists
  //         if (existingUser.imageUrl) {
  //           await deleteImageFromS3(existingUser.imageUrl);
  //         }
  
  //         const { key, name: originalName, mime } = await uploadImageToS3(
  //           file,
  //           "user-profile-images"
  //         );
  
  //         userData.imageUrl = key;
  //         userData.imageName = originalName;
  //         userData.mimeType = mime;
  //       }
  
  //       // 2. Update User
  //       if (userData) {
  //         await tx.user.update({
  //           where: { id: existingTrainee.userId },
  //           data: userData,
  //         });
  //       }
  
  //       // 3. Update Trainee
  //       if (traineeData) {
  //         await tx.trainee.update({
  //           where: { id },
  //           data: traineeData,
  //         });
  //       }
  
  //       // 4. Update Trainee Membership (optional)
  //       if (traineeMembershipData) {
  //         await tx.traineeMembership.updateMany({
  //           where: { traineeId: id },
  //           data: traineeMembershipData,
  //         });
  //       }
  
  //       // 5. Return updated full object
  //       const updatedTrainee = await tx.trainee.findUnique({
  //         where: { id },
  //         include: {
  //           user: true,
  //           traineeMemberships: true,
  //         },
  //       });
  
  //       return updatedTrainee;
  //     });
  //   } catch (error) {
  //     if (error instanceof AppError) throw error;
  
  //     throw new AppError(
  //       `Error updating trainee with ID: ${id}`,
  //       500,
  //       "TRAINEE_DB_UPDATE_ERROR"
  //     );
  //   }
  // }
  

  // static async delete(id: string, gymId: string, gymBranchId: string) {
  //   try {
  //     const trainer = await prisma.trainer.findUnique({
  //       where: { id },
  //     });

  //     if (!trainer) {
  //       throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
  //     }

  //     if (trainer.gymId !== gymId) {
  //       throw new AppError(
  //         "Unauthorized access to trainer",
  //         403,
  //         "UNAUTHORIZED_ACCESS"
  //       );
  //     }

  //     return await prisma.trainer.delete({
  //       where: { id, gymId, gymBranchId },
  //     });
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  //     throw new AppError(
  //       "Error deleting trainer",
  //       500,
  //       "TRAINER_DB_DELETE_ERROR"
  //     );
  //   }
  // }
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
