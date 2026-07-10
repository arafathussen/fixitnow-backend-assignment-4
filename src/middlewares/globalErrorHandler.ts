import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import config from "../config";
import { AppError } from "../utils/AppError";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong!";
    let errorDetails: any = err;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errorDetails || { statusCode: err.statusCode };
    } else if (err instanceof Error) {
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
        stack: undefined,
    });
};
