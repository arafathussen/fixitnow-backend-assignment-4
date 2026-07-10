import { Prisma } from "../../../generated/prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ITechnicianFilterRequest, IUpdateTechnicianProfile } from "./technician.interface";

const updateMyProfile = async (userId: string, payload: IUpdateTechnicianProfile) => {
    const existingProfile = await prisma.technicianProfile.findUnique({
        where: { userId },
    });

    if (!existingProfile) {
        const newProfile = await prisma.technicianProfile.create({
            data: {
                userId,
                bio: payload.bio || "Professional Home Service Technician",
                experienceYears: payload.experienceYears ?? 1,
                hourlyRate: payload.hourlyRate ?? 20.0,
                isAvailable: payload.isAvailable ?? true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                    },
                },
            },
        });
        return newProfile;
    }

    const updatedProfile = await prisma.technicianProfile.update({
        where: { userId },
        data: payload,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
        },
    });

    return updatedProfile;
};

const getAllTechnicians = async (filters: ITechnicianFilterRequest) => {
    const { searchTerm, isAvailable, minRate, maxRate, sortBy, sortOrder, page = 1, limit = 10 } = filters;

    const whereConditions: Prisma.TechnicianProfileWhereInput[] = [];

    if (searchTerm) {
        whereConditions.push({
            OR: [
                { bio: { contains: searchTerm, mode: "insensitive" } },
                {
                    user: {
                        OR: [
                            { name: { contains: searchTerm, mode: "insensitive" } },
                            { address: { contains: searchTerm, mode: "insensitive" } },
                        ],
                    },
                },
            ],
        });
    }

    if (isAvailable !== undefined) {
        const availableBool = typeof isAvailable === "string" ? isAvailable === "true" : Boolean(isAvailable);
        whereConditions.push({
            isAvailable: availableBool,
        });
    }

    if (minRate !== undefined || maxRate !== undefined) {
        const rateCondition: Prisma.FloatFilter = {};
        if (minRate !== undefined) rateCondition.gte = Number(minRate);
        if (maxRate !== undefined) rateCondition.lte = Number(maxRate);
        whereConditions.push({
            hourlyRate: rateCondition,
        });
    }

    const where: Prisma.TechnicianProfileWhereInput = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const result = await prisma.technicianProfile.findMany({
        where,
        skip,
        take,
        orderBy: {
            [sortBy || "rating"]: sortOrder || "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
        },
    });

    const total = await prisma.technicianProfile.count({ where });

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
        data: result,
    };
};

const getTechnicianById = async (id: string) => {
    let profile = await prisma.technicianProfile.findFirst({
        where: {
            OR: [{ id }, { userId: id }],
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
        },
    });

    if (!profile) {
        throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found!");
    }

    const reviews = await prisma.review.findMany({
        where: { technicianId: profile.userId },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return { ...profile, reviews };
};

const getMyProfile = async (userId: string) => {
    let profile = await prisma.technicianProfile.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
        },
    });

    if (!profile) {
        throw new AppError(httpStatus.NOT_FOUND, "You have not created your technician profile yet!");
    }

    const reviews = await prisma.review.findMany({
        where: { technicianId: profile.userId },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return { ...profile, reviews };
};

export const technicianService = {
    updateMyProfile,
    getMyProfile,
    getAllTechnicians,
    getTechnicianById,
};
