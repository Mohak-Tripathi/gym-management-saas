"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = "INTERNAL_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;
        // Capture the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
