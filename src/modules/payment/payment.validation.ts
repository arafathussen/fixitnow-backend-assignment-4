import { z } from "zod";

const createPaymentSchema = z.object({
    body: z.object({
        bookingId: z.string({
            message: "Booking ID is required",
        }),
        paymentMethod: z.string().optional(),
    }),
});

const confirmPaymentSchema = z.object({
    body: z.object({
        transactionId: z.string({
            message: "Transaction ID is required",
        }),
    }),
});

export const paymentValidation = {
    createPaymentSchema,
    confirmPaymentSchema,
};
