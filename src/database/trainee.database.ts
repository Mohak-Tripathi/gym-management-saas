import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();
import { getPresignedImageUrl } from "../utils/getPresignedImageUrl";
import { deleteImageFromS3, uploadImageToS3 } from "../utils/s3";



export class TraineeDatabase {
  static async create(data: any) {
    try {
      return await prisma.trainee.create({ data });
    } catch (error) {
      console.log(error, "error-trainee");
      throw new AppError(
        "Error creating trainee",
        500,
        "TRAINEE_DB_CREATE_ERROR"
      );
    }
  }

  // static async getAll(gymId: string, gymBranchId: string) {
  //   try {
  //     return await prisma.trainee.findMany({
  //       where: { gymId, gymBranchId },
  //       include: {
  //         // traineeMemberships:true,
  //         traineeMemberships: {
  //           include: {
  //             membership: true, // ✅ Include full membership object
  //           },
  //         },
  //         trainer: true,
  //         user: true,
  //       },
  //     });
  //   } catch (error) {
  //     throw new AppError(
  //       "Error fetching trainees",
  //       500,
  //       "TRAINEE_DB_FETCH_ALL_ERROR"
  //     );
  //   }
  // }

  // static async getById(id: string, gymId: string, gymBranchId: string) {
  //   try {
  //     const trainee = await prisma.trainee.findUnique({
  //       where: {
  //         id,
  //         gymId,
  //         gymBranchId,
  //       },
  //       include: {
  //         traineeMemberships:true,
  //         // membership: true,
  //         user: true,
  //         trainer: true,
  //       },
  //     });

  //     if (!trainee) {
  //       throw new AppError("Trainer not found", 404, "TRAINER_NOT_FOUND");
  //     }

  //     return trainee;
  //   } catch (error) {
  //     throw new AppError(
  //       `Error fetching trainee with ID: ${id}`,
  //       500,
  //       "TRAINEE_DB_FETCH_BY_ID_ERROR"
  //     );
  //   }
  // }


  static async getAll(gymId: string, gymBranchId: string) {
    try {
      const trainees = await prisma.trainee.findMany({
        where: { gymId, gymBranchId },
        include: {
          traineeMemberships: {
            include: {
              membership: true,
            },
          },
          trainer: true,
          user: true,
        },
        orderBy: {
          updatedAt: 'desc', // Most recently updated or created at top
        },
      });
  
      const processedTrainees = await Promise.all(
        trainees.map(async (trainee) => {

          const signedImageUrl = await getPresignedImageUrl(trainee.user?.imageUrl);
        
  
          return {
            ...trainee,
            imageUrl: signedImageUrl,
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

  

  
  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      const trainee = await prisma.trainee.findFirst({
        where: {
          id,
          gymId,
          gymBranchId,
        },
        include: {
          traineeMemberships: {
            include: {
              membership: true,
            },
          },
          user: true,
          trainer: true,
        },
      });
  
      if (!trainee) {
        throw new AppError("Trainee not found", 404, "TRAINEE_NOT_FOUND");
      }

      const signedImageUrl = await getPresignedImageUrl(trainee.user?.imageUrl);
  
   
  
      return {
        ...trainee,
        imageUrl: signedImageUrl,
      };
    } catch (error) {
      throw new AppError(
        `Error fetching trainee with ID: ${id}`,
        500,
        "TRAINEE_DB_FETCH_BY_ID_ERROR"
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
  //     // return await prisma.trainee.update({ where: { id }, data });

  //     const existingTrainee = await prisma.trainee.findFirst({
  //       where: {
  //         id,
  //         gymId,
  //         gymBranchId,
  //       },
  //       include: {
  //         user: true,
  //         traineeMemberships:true,
  //       },
  //     });

  //     if (!existingTrainee) {
  //       throw new AppError(
  //         "Trainee not found or unauthorized access",
  //         404,
  //         "TRAINER_NOT_FOUND"
  //       );
  //     }

  //     const updatedTrainee = await prisma.trainee.update({
  //       where: { id, gymId, gymBranchId }, // Just need id here since we already verified access
  //       data: data,
  //       include: {
  //         user: true
  //       },
  //     });

  //     return updatedTrainee;
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       throw error;
  //     }

  //     throw new AppError(
  //       `Error updating trainee with ID: ${id}`,
  //       500,
  //       "TRAINEE_DB_UPDATE_ERROR"
  //     );
  //   }
  // }



  static async updateTraineeProfileDB(
    id: string,
    profileData: any,
    gymId: string,
    gymBranchId: string
  ) {
    try {
      // First verify the trainee exists and belongs to the correct gym/branch
      const existingTrainee = await prisma.trainee.findFirst({
        where: {
          id,
          gymId,
          gymBranchId,
        },
      });
  
      if (!existingTrainee) {
        throw new AppError(
          "Trainee not found or unauthorized access",
          404,
          "TRAINEE_NOT_FOUND"
        );
      }
  
      // Update the trainee with profile data
      const updatedTrainee = await prisma.trainee.update({
        where: { 
          id ,
            gymId,
            gymBranchId
          
        },
        data: {
          targetMuscleGroups: profileData.targetMuscleGroups,
          trainingExperience: profileData.trainingExperience,
          activityLevel: profileData.activityLevel,
          pushupCount: profileData.pushupCount,
          motivationSource: profileData.motivationSource,
          workoutFrequency: profileData.workoutFrequency,
          workoutDuration: profileData.workoutDuration,
          wantsNotifications: profileData.wantsNotifications,
        },
        include: {
          user: true, // Include user data in response if needed
        },
      });
  
      return updatedTrainee;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error updating trainee profile",
        500,
        "TRAINEE_PROFILE_UPDATE_ERROR"
      );
    }
  }




  static async updateTrainee(
    id: string,
    data: any,
    gymId: string,
    gymBranchId: string,
    file?: Express.Multer.File
  ) {
    const { userData, traineeData, traineeMembershipData } = data;
  
    try {
      return await prisma.$transaction(async (tx) => {
        const existingTrainee = await tx.trainee.findFirst({
          where: { id },
          include: {
            user: true,
            traineeMemberships: true,
          },
        });
  
        if (!existingTrainee) {
          throw new AppError("Trainee not found", 404, "TRAINEE_NOT_FOUND");
        }
  
        if (
          existingTrainee.gymId !== gymId ||
          existingTrainee.gymBranchId !== gymBranchId
        ) {
          throw new AppError("Unauthorized access", 403, "UNAUTHORIZED_ACCESS");
        }
  
        // 1. Handle image update if file is provided
        if (file && userData) {
          const existingUser = existingTrainee.user;
  
          // Delete old image if exists
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
  
        // 2. Update User
        if (userData) {
          await tx.user.update({
            where: { id: existingTrainee.userId },
            data: userData,
          });
        }
  
        // 3. Update Trainee
        if (traineeData) {
          await tx.trainee.update({
            where: { id },
            data: traineeData,
          });
        }
  
        // 4. Update Trainee Membership (optional)
        if (traineeMembershipData) {
          await tx.traineeMembership.updateMany({
            where: { traineeId: id },
            data: traineeMembershipData,
          });
        }
  
        // 5. Return updated full object
        const updatedTrainee = await tx.trainee.findUnique({
          where: { id },
          include: {
            user: true,
            traineeMemberships: true,
          },
        });
  
        return updatedTrainee;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
  
      throw new AppError(
        `Error updating trainee with ID: ${id}`,
        500,
        "TRAINEE_DB_UPDATE_ERROR"
      );
    }
  }
  


  // static async updateTrainee(
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
  //         where: {
  //           id,
  //         },
  //         include: {
  //           user: true,
  //           traineeMemberships: true,
  //         },
  //       });
  
  //       if (!existingTrainee) {
  //         throw new AppError(
  //           "Trainee not found",
  //           404,
  //           "TRAINEE_NOT_FOUND"
  //         );
  //       }
  
  //       if (
  //         existingTrainee.gymId !== gymId ||
  //         existingTrainee.gymBranchId !== gymBranchId
  //       ) {
  //         throw new AppError(
  //           "Unauthorized access",
  //           403,
  //           "UNAUTHORIZED_ACCESS"
  //         );
  //       }
  
  //       // 1. Update User
  //       if (userData) {
  //         await tx.user.update({
  //           where: { id: existingTrainee.userId },
  //           data: userData,
  //         });
  //       }
  
  //       // 2. Update Trainee
  //       if (traineeData) {
  //         await tx.trainee.update({
  //           where: { id },
  //           data: traineeData,
  //         });
  //       }
  
  //       // 3. Update TraineeMembership (optional)
  //       if (traineeMembershipData) {
  //         // You can either updateMany or delete & recreate, depending on structure
  //         // Here's an example assuming one-to-one membership
  //         await tx.traineeMembership.updateMany({
  //           where: {
  //             traineeId: id,
  //           },
  //           data: traineeMembershipData,
  //         });
  //       }
  
  //       // 4. Return full updated data
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
  //     if (error instanceof AppError) {
  //       throw error;
  //     }
  
  //     throw new AppError(
  //       `Error updating trainee with ID: ${id}`,
  //       500,
  //       "TRAINEE_DB_UPDATE_ERROR"
  //     );
  //   }
  // }
  

  // static async delete(id: string, gymId: string, gymBranchId: string) {
  //   try {
  //     const trainee = await prisma.trainee.findUnique({
  //       where: { id },
  //     });

  //     if (!trainee) {
  //       throw new AppError("Trainee not found", 404, "TRAINEE_NOT_FOUND");
  //     }

  //     if (trainee.gymId !== gymId) {
  //       throw new AppError(
  //         "Unauthorized access to trainee",
  //         403,
  //         "UNAUTHORIZED_ACCESS"
  //       );
  //     }

  //     return await prisma.trainee.delete({
  //       where: { id, gymId, gymBranchId },
  //     });
  //     // return await prisma.trainee.delete({ where: { id } });
  //   } catch (error) {
  //     throw new AppError(
  //       `Error deleting trainee with ID: ${id}`,
  //       500,
  //       "TRAINEE_DB_DELETE_ERROR"
  //     );
  //   }
  // }
}
