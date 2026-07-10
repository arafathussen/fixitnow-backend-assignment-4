import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await technicianService.updateMyProfile(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician profile updated successfully",
        data: result,
    });
});

const getAllTechnicians = catchAsync(async (req: Request, res: Response) => {
    const result = await technicianService.getAllTechnicians(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technicians retrieved successfully",
        data: result,
    });
});

const getTechnicianById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await technicianService.getTechnicianById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician profile details retrieved successfully",
        data: result,
    });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await technicianService.getMyProfile(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician profile retrieved successfully",
        data: result,
    });
});

const getMyAvailability = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const profile = await technicianService.getMyProfile(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician availability status retrieved successfully",
        data: {
            userId: profile.userId,
            isAvailable: profile.isAvailable,
        },
    });
});

export const technicianController = {
    updateMyProfile,
    getMyProfile,
    getMyAvailability,
    getAllTechnicians,
    getTechnicianById,
};
