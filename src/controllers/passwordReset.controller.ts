import { Request, Response } from "express";
import { PasswordResetService } from "../services/passwordReset.service";
import { AppError } from "../utils/AppError";

export class PasswordResetController {

  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    try {
      await PasswordResetService.setPasswordViaToken(token, newPassword);
      res.status(200).send("Password reset successfully");
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      }else{
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  }
}
