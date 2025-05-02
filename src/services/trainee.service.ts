// ✅ Service Layer - src/services/trainee.service.ts
import { TraineeDatabase } from "../database/trainee.database";
import { TraineeMembershipDatabase } from "../database/traineemembership.database";
import { AppError } from "../utils/AppError";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import { sendPasswordSetupEmail } from "../utils/emailService";
import { hashPassword } from "../utils/hashPassword";

export class TraineeService {


static async onboardTraineeWithMembership(data: any) {

  const {
    userData, // contains email, password, fullName, role (should be TRAINEE), etc.
    traineeData, // contains gender, DOB, etc.
    traineeMembershipData, // contains membershipId, startDate, endDate, price, etc.
  } = data;

  try {

    if (userData.role !== 'TRAINEE') {
        throw new AppError("Invalid user role for trainee onboarding", 400, "INVALID_ROLE");
      }

      // Generate a secure random password
      const plainPassword = crypto.randomBytes(12).toString("hex"); // 24 character random string
      // Hash the password for storage
      const hashedPassword = await hashPassword(plainPassword);


    const result = await prisma.$transaction(async (tx:any) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          ...userData,
          password: hashedPassword, // Store hashed password
        }
      });

      // 2. Create Trainee linked to User
      const trainee = await tx.trainee.create({
        data: {
          ...traineeData,
          userId: user.id,
        },
      });

      // 3. Create Membership linked to Trainee
      const fullMembershipData = {
        ...traineeMembershipData,
        traineeId: trainee.id,
      };

      const membership = await tx.traineeMembership.create({
        data: fullMembershipData,
      });


      // const token = crypto.randomBytes(32).toString('hex');
      // const expiresAt = addMinutes(new Date(), 60);
    
      // await tx.passwordSetupToken.create({
      //   data: { token, userId: user.id, expiresAt },
      // });
    
      return { user, trainee, traineeMembership: membership, plainPassword};
    });

    // ✅ Transaction complete

    // 📤 Email logic AFTER transaction
    console.log(result, "result")
    await sendPasswordSetupEmail(result.user.email, result.plainPassword);

  } catch (error) {
    console.error("Onboarding Error:", error);
    throw new AppError(
      "Error onboarding trainee with membership",
      500,
      "TRAINEE_ONBOARDING_ERROR"
    );
  }
}


  static async getAllTrainees(gymId: string, gymBranchId: string) {
    try {
      const trainees = await TraineeDatabase.getAll(gymId, gymBranchId);
      return trainees;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching trainees",
        500,
        "TRAINEE_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getTraineeById(id: string, gymId: string, gymBranchId: string) {
    try {
      const trainee = await TraineeDatabase.getById(id, gymId, gymBranchId);
      if (!trainee) {
        throw new AppError(
          "Trainee not found",
          404,
          "TRAINEE_SERVICE_NOT_FOUND_ERROR"
        );
      }
      return trainee;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error fetching trainee with ID: ${id}`,
        500,
        "TRAINEE_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async updateTrainee(    id: string,
    data: any,
    gymId: string,
    gymBranchId: string) {
    try {
      const trainee = await TraineeDatabase.update(id, data, gymId, gymBranchId);
      return trainee;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error updating trainee with ID: ${id}`,
        500,
        "TRAINEE_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async deleteTrainee(id: string, gymId: string, gymBranchId: string) {
    try {
      await TraineeDatabase.delete(id, gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error deleting trainee with ID: ${id}`,
        500,
        "TRAINEE_SERVICE_DELETE_ERROR"
      );
    }
  }
}




  //   static async createTrainee(data: any) {
  //     try {
  //       const trainee = await TraineeDatabase.create(data);
  //       return trainee;
  //     } catch (error) {
  //       if (error instanceof AppError) {
  //         throw error;
  //       }
  //       throw new AppError(
  //         "Error creating trainee",
  //         500,
  //         "TRAINEE_SERVICE_CREATE_ERROR"
  //       );
  //     }
  //   }

  //createTrainee got extended

  //Wrap this is Transactions later TODO - Use Prisma Transactions.

//   static async onboardTraineeWithMembership(data: any) {
//     const {
//       traineeData,
//       traineeMembershipData, // contains membershipId, price, dates, etc.
//     } = data;

//     try {
//       const trainee = await TraineeDatabase.create(traineeData);

//       // Add traineeId to membership data
//       const fullMembershipData = {
//         ...traineeMembershipData,
//         traineeId: trainee.id,
//       };

//       const membership = await TraineeMembershipDatabase.create(
//         fullMembershipData
//       );

//       return {
//         trainee,
//         traineeMembership: membership,
//       };
//     } catch (error) {
//       console.error("Onboarding Error:", error);
//       throw new AppError(
//         "Error onboarding trainee with membership",
//         500,
//         "TRAINEE_ONBOARDING_ERROR"
//       );
//     }
//   }