"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerService = void 0;
const trainer_database_1 = require("../database/trainer.database");
const AppError_1 = require("../utils/AppError");
const emailService_1 = require("../utils/emailService");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const crypto_1 = __importDefault(require("crypto"));
const date_fns_1 = require("date-fns");
class TrainerService {
    // static async createTrainer(data: any) {
    //   try {
    //     const trainer = await TrainerDB.create(data);
    //     return trainer;
    //   } catch (error) {
    //     if (error instanceof AppError) {
    //       throw error;
    //     }
    //     throw new AppError(
    //       "Error creating trainer",
    //       500,
    //       "TRAINER_SERVICE_CREATE_ERROR"
    //     );
    //   }
    // }
    static async onBoardTrainer(data) {
        const { userData, // contains email, password, fullName, role (should be TRAINER), etc.
        trainerData, // contains specialization, experience, etc.
         } = data;
        try {
            if (userData.role !== 'TRAINER') {
                throw new AppError_1.AppError("Invalid user role for trainer onboarding", 400, "INVALID_ROLE");
            }
            const result = await prisma.$transaction(async (tx) => {
                // 1. Create User
                const user = await tx.user.create({
                    data: userData,
                });
                // 2. Create Trainer linked to User
                const trainer = await tx.trainer.create({
                    data: {
                        ...trainerData,
                        userId: user.id,
                    },
                });
                const token = crypto_1.default.randomBytes(32).toString('hex');
                const expiresAt = (0, date_fns_1.addMinutes)(new Date(), 60);
                await tx.passwordSetupToken.create({
                    data: { token, userId: user.id, expiresAt },
                });
                return { user, trainer, token };
            });
            // 📤 Email logic AFTER transaction
            await (0, emailService_1.sendPasswordSetupEmail)(result.user.email, result.token);
            return result;
        }
        catch (error) {
            console.error("Onboarding Error:", error);
            throw new AppError_1.AppError("Error onboarding trainer", 500, "TRAINER_ONBOARDING_ERROR");
        }
    }
    static async getAllTrainers() {
        try {
            const trainers = await trainer_database_1.TrainerDB.getAll();
            return trainers;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError("Error fetching trainers", 500, "TRAINER_SERVICE_FETCH_ALL_ERROR");
        }
    }
    static async getTrainerById(id) {
        try {
            const trainer = await trainer_database_1.TrainerDB.getById(id);
            if (!trainer) {
                throw new AppError_1.AppError("Trainer not found", 404, "TRAINER_SERVICE_NOT_FOUND_ERROR");
            }
            return trainer;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error fetching trainer with ID: ${id}`, 500, "TRAINER_SERVICE_FETCH_BY_ID_ERROR");
        }
    }
    static async updateTrainer(id, data) {
        try {
            const trainer = await trainer_database_1.TrainerDB.update(id, data);
            return trainer;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error updating trainer with ID: ${id}`, 500, "TRAINER_SERVICE_UPDATE_ERROR");
        }
    }
    static async deleteTrainer(id) {
        try {
            const trainer = await trainer_database_1.TrainerDB.delete(id);
            return trainer;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(`Error deleting trainer with ID: ${id}`, 500, "TRAINER_SERVICE_DELETE_ERROR");
        }
    }
}
exports.TrainerService = TrainerService;
