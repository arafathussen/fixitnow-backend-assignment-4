import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryService.getCategoryById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category details retrieved successfully",
        data: result,
    });
});

export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
};
