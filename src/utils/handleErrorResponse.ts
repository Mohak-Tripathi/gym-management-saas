// utils/handleErrorResponse.ts
import { Response } from "express";
import { AppError } from "./AppError";

export function handleErrorResponse(res: Response, err: unknown) {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : "Something went wrong";
  const errorCode = err instanceof AppError ? err.errorCode : "UNKNOWN_ERROR";

  return res.status(status).json({
    success: false,
    message,
    errorCode,
  });
}
