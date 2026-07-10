import express from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { bookingController } from "./booking.controller";
import { bookingValidation } from "./booking.validation";

const customerRouter = express.Router();
const technicianRouter = express.Router();
const adminRouter = express.Router();

// 1. Customer routes (/api/bookings)
customerRouter.post(
    "/",
    auth(Role.CUSTOMER),
    validateRequest(bookingValidation.createBookingSchema),
    bookingController.createBooking
);

customerRouter.get(
    "/",
    auth(Role.CUSTOMER),
    bookingController.getCustomerBookings
);

customerRouter.get(
    "/:id",
    auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
    bookingController.getBookingById
);

customerRouter.patch(
    "/:id/cancel",
    auth(Role.CUSTOMER),
    bookingController.cancelBooking
);

customerRouter.patch(
    "/:id",
    auth(Role.TECHNICIAN, Role.CUSTOMER),
    validateRequest(bookingValidation.updateBookingStatusSchema),
    (req, res, next) => {
        if ((req as any).user?.role === Role.CUSTOMER && req.body.status === "CANCELLED") {
            return bookingController.cancelBooking(req, res, next);
        }
        return bookingController.updateBookingStatus(req, res, next);
    }
);

customerRouter.patch(
    "/:id/status",
    auth(Role.TECHNICIAN),
    validateRequest(bookingValidation.updateBookingStatusSchema),
    bookingController.updateBookingStatus
);

// 2. Technician routes (/api/technician/bookings or /api/technicians/bookings)
technicianRouter.get(
    "/",
    auth(Role.TECHNICIAN),
    bookingController.getTechnicianBookings
);

technicianRouter.get(
    "/:id",
    auth(Role.TECHNICIAN, Role.ADMIN),
    bookingController.getBookingById
);

technicianRouter.patch(
    "/:id",
    auth(Role.TECHNICIAN),
    validateRequest(bookingValidation.updateBookingStatusSchema),
    bookingController.updateBookingStatus
);

technicianRouter.patch(
    "/:id/status",
    auth(Role.TECHNICIAN),
    validateRequest(bookingValidation.updateBookingStatusSchema),
    bookingController.updateBookingStatus
);

// 3. Admin routes (/api/admin/bookings)
adminRouter.get(
    "/",
    auth(Role.ADMIN),
    bookingController.getAllBookingsAdmin
);

adminRouter.get(
    "/:id",
    auth(Role.ADMIN),
    bookingController.getBookingById
);

export const bookingRoutes = customerRouter;
export const technicianBookingRoutes = technicianRouter;
export const adminBookingRoutes = adminRouter;
