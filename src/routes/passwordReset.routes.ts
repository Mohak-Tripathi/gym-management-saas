import express from 'express';
import { PasswordResetController } from "../controllers/passwordReset.controller";

const router = express.Router();

// Endpoint to reset password using token
router.post('/reset', PasswordResetController.resetPassword);

export default router;
