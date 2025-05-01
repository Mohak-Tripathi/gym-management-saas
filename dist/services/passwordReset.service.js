"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const hashPassword_1 = require("../utils/hashPassword"); // Assuming you have a hash function
// import { PasswordSetupTokenDatabase } from "../database/passwordSetupToken.database"; // For token DB interactions
const prisma = new client_1.PrismaClient();
class PasswordResetService {
    static async setPasswordViaToken(token, newPassword) {
        // Step 1: Find the token record in the database
        const tokenRecord = await prisma.passwordSetupToken.findUnique({
            where: { token },
        });
        // Step 2: Validate the token
        if (!tokenRecord ||
            tokenRecord.used ||
            tokenRecord.expiresAt < new Date()) {
            throw new AppError_1.AppError("Token is invalid or expired", 400, "TOKEN_INVALID");
        }
        // Step 3: Hash the new password
        const hashed = await (0, hashPassword_1.hashPassword)(newPassword);
        // Step 4: Use a transaction to update the user and mark token as used
        return await prisma.$transaction([
            prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { password: hashed },
            }),
            prisma.passwordSetupToken.update({
                where: { id: tokenRecord.id },
                data: { used: true },
            }),
        ]);
    }
}
exports.PasswordResetService = PasswordResetService;
