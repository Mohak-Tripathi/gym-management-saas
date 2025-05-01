"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeService = void 0;
// ✅ Service Layer - src/services/trainee.service.ts
const trainee_database_1 = require("../database/trainee.database");
const AppError_1 = require("../utils/AppError");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const crypto_1 = __importDefault(require("crypto"));
const date_fns_1 = require("date-fns");
const emailService_1 = require("../utils/emailService");
class TraineeService {
    static async onboardTraineeWithMembership(data) {
        const { userData, // contains email, password, fullName, role (should be TRAINEE), etc.
        traineeData, // contains gender, DOB, etc.
        traineeMembershipData, // contains membershipId, startDate, endDate, price, etc.
         } = data;
        try {
            if (userData.role !== 'TRAINEE') {
                throw new AppError_1.AppError("Invalid user role for trainee onboarding", 400, "INVALID_ROLE");
            }
            const result = await prisma.$transaction(async (tx) => {
                // 1. Create User
                const user = await tx.user.create({
                    data: userData,
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
                const token = crypto_1.default.randomBytes(32).toString('hex');
                const expiresAt = (0, date_fns_1.addMinutes)(new Date(), 60);
                await tx.passwordSetupToken.create({
                    data: { token, userId: user.id, expiresAt },
                });
                return { user, trainee, traineeMembership: membership, token };
            });
            // ✅ Transaction complete
            // 📤 Email logic AFTER transaction
            console.log(result, "result");
            await (0, emailService_1.sendPasswordSetupEmail)(result.user.email, result.token);
        }
        catch (error) {
            console.error("Onboarding Error:", error);
            throw new AppError_1.AppError("Error onboarding trainee with membership", 500, "TRAINEE_ONBOARDING_ERROR");
        }
    }
    static async getAllTrainees() {
        try {
            const trainees = await trainee_database_1.TraineeDatabase.getAll();
            return trainees;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Error fetching trainees", 500, "TRAINEE_SERVICE_FETCH_ALL_ERROR");
        }
    }
    static async getTraineeById(id) {
        try {
            const trainee = await trainee_database_1.TraineeDatabase.getById(id);
            if (!trainee) {
                throw new AppError_1.AppError("Trainee not found", 404, "TRAINEE_SERVICE_NOT_FOUND_ERROR");
            }
            return trainee;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error fetching trainee with ID: ${id}`, 500, "TRAINEE_SERVICE_FETCH_BY_ID_ERROR");
        }
    }
    static async updateTrainee(id, data) {
        try {
            const trainee = await trainee_database_1.TraineeDatabase.update(id, data);
            return trainee;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error updating trainee with ID: ${id}`, 500, "TRAINEE_SERVICE_UPDATE_ERROR");
        }
    }
    static async deleteTrainee(id) {
        try {
            await trainee_database_1.TraineeDatabase.delete(id);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error deleting trainee with ID: ${id}`, 500, "TRAINEE_SERVICE_DELETE_ERROR");
        }
    }
}
exports.TraineeService = TraineeService;
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
