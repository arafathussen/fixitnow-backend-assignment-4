import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllUsersAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsersAdmin();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All users retrieved successfully",
        data: result,
    });
});

const updateUserBanStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isBanned } = req.body;

    const result = await adminService.updateUserBanStatus(id as string, isBanned);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User ${isBanned ? "banned" : "unbanned"} successfully`,
        data: result,
    });
});

export const adminController = {
    getAllUsersAdmin,
    updateUserBanStatus,
};
