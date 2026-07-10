import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
    const result = await serviceService.createService(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Service created successfully",
        data: result,
    });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
    const result = await serviceService.getAllServices(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Services retrieved successfully",
        data: result,
    });
});

const getServiceById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await serviceService.getServiceById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Service details retrieved successfully",
        data: result,
    });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await serviceService.updateService(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Service updated successfully",
        data: result,
    });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await serviceService.deleteService(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Service deleted successfully",
        data: null,
    });
});

export const serviceController = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
};
