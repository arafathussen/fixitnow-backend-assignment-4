import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { Role } from "../../../generated/prisma/client";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IAuthResponse, ILoginUser, IRegisterUser } from "./auth.interface";

const registerUser = async (payload: IRegisterUser): Promise<IAuthResponse> => {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists!");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(payload.password!, 12);

    // 3. Create user in database (in transaction if role is TECHNICIAN)
    const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: hashedPassword,
                role: payload.role || Role.CUSTOMER,
                phone: payload.phone || null,
                address: payload.address || null,
            },
        });

        // If user is a technician, create a default TechnicianProfile
        if (user.role === Role.TECHNICIAN) {
            await tx.technicianProfile.create({
                data: {
                    userId: user.id,
                    bio: "Professional Home Service Technician",
                    experienceYears: 1,
                    hourlyRate: 20.0,
                    isAvailable: true,
                },
            });
        }

        return user;
    });

    // 4. Generate JWT Token
    const accessToken = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        config.jwt.secret as string,
        { expiresIn: (config.jwt.expiresIn || "7d") as any }
    );

    return {
        accessToken,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            address: newUser.address,
        },
    };
};

const loginUser = async (payload: ILoginUser): Promise<IAuthResponse> => {
    // 1. Check if user exists
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found with this email!");
    }

    // 2. Verify password
    const isPasswordMatched = await bcrypt.compare(payload.password!, user.password);
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password!");
    }

    // 3. Generate JWT Token
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwt.secret as string,
        { expiresIn: (config.jwt.expiresIn || "7d") as any }
    );

    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
        },
    };
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            createdAt: true,
            technicianProfile: true,
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User profile not found!");
    }

    return user;
};

export const authService = {
    registerUser,
    loginUser,
    getMe,
};
