import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const getAllUsersAdmin = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            isBanned: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return users;
};

const updateUserBanStatus = async (userId: string, isBanned: boolean) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (user.role === "ADMIN") {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot ban an admin user!");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isBanned },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isBanned: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

export const adminService = {
    getAllUsersAdmin,
    updateUserBanStatus,
};
