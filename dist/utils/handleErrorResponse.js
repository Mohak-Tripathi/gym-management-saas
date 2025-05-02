"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorResponse = void 0;
const AppError_1 = require("./AppError");
function handleErrorResponse(res, err) {
    const status = err instanceof AppError_1.AppError ? err.statusCode : 500;
    const message = err instanceof AppError_1.AppError ? err.message : "Something went wrong";
    const errorCode = err instanceof AppError_1.AppError ? err.errorCode : "UNKNOWN_ERROR";
    return res.status(status).json({
        success: false,
        message,
        errorCode
    });
}
exports.handleErrorResponse = handleErrorResponse;
