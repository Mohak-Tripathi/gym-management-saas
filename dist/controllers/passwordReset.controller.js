"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetController = void 0;
const passwordReset_service_1 = require("../services/passwordReset.service");
const AppError_1 = require("../utils/AppError");
class PasswordResetController {
    static async resetPassword(req, res) {
        const { token, newPassword } = req.body;
        try {
            await passwordReset_service_1.PasswordResetService.setPasswordViaToken(token, newPassword);
            res.status(200).send("Password reset successfully");
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }
}
exports.PasswordResetController = PasswordResetController;
