import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
        where: { name: payload.name },
    });

    if (existingCategory) {
        throw new AppError(httpStatus.CONFLICT, "Category with this name already exists!");
    }

    const newCategory = await prisma.category.create({
        data: payload,
    });

    return newCategory;
};

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { services: true },
            },
        },
    });

    return categories;
};

const getCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            services: true,
        },
    });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
    }

    return category;
};

export const categoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
};
