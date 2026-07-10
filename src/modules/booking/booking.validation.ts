import { z } from "zod";
import { BookingStatus } from "../../../generated/prisma/client";

const createBookingSchema = z.object({
    body: z.object({
        serviceId: z.string({
            message: "Service ID is required",
        }),
        technicianId: z.string({
            message: "Technician ID is required",
        }),
        bookingDate: z.string({
            message: "Booking date is required",
        }),
        address: z.string({
            message: "Address is required",
        }).min(5, "Address must be at least 5 characters"),
        notes: z.string().optional(),
    }),
});

const updateBookingStatusSchema = z.object({
    body: z.object({
        status: z.enum(
            [
                BookingStatus.ACCEPTED,
                BookingStatus.DECLINED,
                BookingStatus.IN_PROGRESS,
                BookingStatus.COMPLETED,
            ],
            {
                message: "Status must be one of: ACCEPTED, DECLINED, IN_PROGRESS, COMPLETED",
            }
        ),
    }),
});

export const bookingValidation = {
    createBookingSchema,
    updateBookingStatusSchema,
};
