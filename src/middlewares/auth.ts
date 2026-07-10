import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

export const auth = (...roles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized! Token missing or invalid format.");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized! Token not found.");
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
        } catch (error) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired JWT token!");
        }

        const { id, role } = decoded;

        // Check if user still exists in database
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new AppError(httpStatus.UNAUTHORIZED, "This user no longer exists in the database!");
        }

        if (user.isBanned) {
            throw new AppError(httpStatus.FORBIDDEN, "Your account is banned!");
        }

        // Check Role-Based Access Control (RBAC)
        if (roles.length > 0 && !roles.includes(role)) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                `Access denied! You need one of the following roles: [${roles.join(", ")}]`
            );
        }

        (req as any).user = decoded;
        next();
    });
};
