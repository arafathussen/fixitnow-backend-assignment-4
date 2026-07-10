import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const customerId = (req as any).user.id;
    const result = await bookingService.createBooking(customerId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Booking created successfully",
        data: result,
    });
});

const getCustomerBookings = catchAsync(async (req: Request, res: Response) => {
    const customerId = (req as any).user.id;
    const result = await bookingService.getCustomerBookings(customerId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
    });
});

const getTechnicianBookings = catchAsync(async (req: Request, res: Response) => {
    const technicianId = (req as any).user.id;
    const result = await bookingService.getTechnicianBookings(technicianId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician bookings retrieved successfully",
        data: result,
    });
});

const getAllBookingsAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await bookingService.getAllBookingsAdmin();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All bookings retrieved successfully",
        data: result,
    });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const role = (req as any).user.role;

    const result = await bookingService.getBookingById(id as string, userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking details retrieved successfully",
        data: result,
    });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const technicianId = (req as any).user.id;

    const result = await bookingService.updateBookingStatus(id as string, technicianId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking status updated successfully",
        data: result,
    });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const customerId = (req as any).user.id;

    const result = await bookingService.cancelBooking(id as string, customerId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking cancelled successfully",
        data: result,
    });
});

export const bookingController = {
    createBooking,
    getCustomerBookings,
    getTechnicianBookings,
    getAllBookingsAdmin,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
};
