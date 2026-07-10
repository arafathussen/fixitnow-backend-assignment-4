import { Prisma } from "../../../generated/prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateService, IServiceFilterRequest, IUpdateService } from "./service.interface";

const createService = async (payload: ICreateService) => {
    const category = await prisma.category.findUnique({
        where: { id: payload.categoryId },
    });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, "Specified category does not exist!");
    }

    // Find technician profile by id OR by userId
    let technicianProfile = await prisma.technicianProfile.findFirst({
        where: {
            OR: [{ id: payload.technicianId }, { userId: payload.technicianId }],
        },
    });

    if (!technicianProfile) {
        throw new AppError(httpStatus.NOT_FOUND, "Specified technician profile does not exist!");
    }

    // Ensure we use the actual technicianProfile ID
    payload.technicianId = technicianProfile.id;

    const newService = await prisma.service.create({
        data: payload,
        include: {
            category: true,
            technician: {
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
            },
        },
    });

    return newService;
};

const getAllServices = async (filters: IServiceFilterRequest) => {
    const { searchTerm, categoryId, technicianId, minPrice, maxPrice, sortBy, sortOrder, page = 1, limit = 10 } = filters;

    const whereConditions: Prisma.ServiceWhereInput[] = [];

    if (searchTerm) {
        whereConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }

    if (categoryId) {
        whereConditions.push({
            categoryId,
        });
    }

    if (technicianId) {
        whereConditions.push({
            OR: [{ technicianId }, { technician: { userId: technicianId } }],
        });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceCondition: Prisma.FloatFilter = {};
        if (minPrice !== undefined) priceCondition.gte = Number(minPrice);
        if (maxPrice !== undefined) priceCondition.lte = Number(maxPrice);
        whereConditions.push({
            price: priceCondition,
        });
    }

    const where: Prisma.ServiceWhereInput = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const result = await prisma.service.findMany({
        where,
        skip,
        take,
        orderBy: {
            [sortBy || "createdAt"]: sortOrder || "desc",
        },
        include: {
            category: true,
            technician: {
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
            },
        },
    });

    const total = await prisma.service.count({ where });

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

const getServiceById = async (id: string) => {
    const service = await prisma.service.findUnique({
        where: { id },
        include: {
            category: true,
            technician: {
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
            },
            bookings: {
                select: {
                    id: true,
                    status: true,
                    bookingDate: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found!");
    }

    return service;
};

const updateService = async (id: string, payload: IUpdateService) => {
    const existingService = await prisma.service.findUnique({
        where: { id },
    });

    if (!existingService) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found!");
    }

    if (payload.categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: payload.categoryId },
        });
        if (!category) {
            throw new AppError(httpStatus.NOT_FOUND, "Specified category does not exist!");
        }
    }

    if (payload.technicianId) {
        const technicianProfile = await prisma.technicianProfile.findFirst({
            where: {
                OR: [{ id: payload.technicianId }, { userId: payload.technicianId }],
            },
        });
        if (!technicianProfile) {
            throw new AppError(httpStatus.NOT_FOUND, "Specified technician profile does not exist!");
        }
        payload.technicianId = technicianProfile.id;
    }

    const updatedService = await prisma.service.update({
        where: { id },
        data: payload,
        include: {
            category: true,
            technician: {
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
            },
        },
    });

    return updatedService;
};

const deleteService = async (id: string) => {
    const existingService = await prisma.service.findUnique({
        where: { id },
    });

    if (!existingService) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found!");
    }

    await prisma.service.delete({
        where: { id },
    });

    return null;
};

export const serviceService = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
};
