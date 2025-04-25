import { PrismaClient } from '@prisma/client';
import { AppError } from "../utils/AppError";
import { hashPassword } from "../utils/hashPassword"; // Assuming you have a hash function
// import { PasswordSetupTokenDatabase } from "../database/passwordSetupToken.database"; // For token DB interactions

const prisma = new PrismaClient();

export class PasswordResetService {

  static async setPasswordViaToken(token: string, newPassword: string) {
    // Step 1: Find the token record in the database
    const tokenRecord = await prisma.passwordSetupToken.findUnique({
      where: { token },
    });

    // Step 2: Validate the token
    if (
      !tokenRecord ||
      tokenRecord.used ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new AppError("Token is invalid or expired", 400, "TOKEN_INVALID");
    }

    // Step 3: Hash the new password
    const hashed = await hashPassword(newPassword);

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
