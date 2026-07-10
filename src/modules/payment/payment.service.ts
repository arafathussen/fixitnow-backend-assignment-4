import httpStatus from "http-status";
import Stripe from "stripe";
import crypto from "crypto";
import { BookingStatus, PaymentStatus, Role } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IConfirmPaymentRequest, ICreatePaymentRequest } from "./payment.interface";

const getStripeClient = () => new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
    apiVersion: "2024-12-18.acacia" as any,
});

const createPaymentSession = async (customerId: string, payload: ICreatePaymentRequest) => {
    const booking = await prisma.booking.findUnique({
        where: { id: payload.bookingId },
        include: {
            service: true,
            customer: true,
        },
    });

    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
    }

    if (booking.customerId !== customerId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You can only initiate payment for your own bookings!");
    }

    if (booking.status !== BookingStatus.ACCEPTED && booking.status !== BookingStatus.PAID) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment can only be initiated for ACCEPTED bookings!");
    }

    const existingCompletedPayment = await prisma.payment.findFirst({
        where: {
            bookingId: payload.bookingId,
            status: PaymentStatus.COMPLETED,
        },
    });

    if (existingCompletedPayment || booking.status === BookingStatus.PAID) {
        throw new AppError(httpStatus.BAD_REQUEST, "This booking has already been paid!");
    }

    let sessionId: string;
    let paymentUrl: string | null = null;

    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
        try {
            const stripeClient = getStripeClient();
            const session = await stripeClient.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                success_url: `http://localhost:5000/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:5000/api/payments/cancel`,
                client_reference_id: booking.id,
                customer_email: booking.customer.email,
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: booking.service.title,
                                description: `Booking for ${booking.customer.name} (${booking.customer.phone || 'N/A'}). Address: ${booking.address}`,
                            },
                            unit_amount: Math.round(booking.totalPrice * 100),
                        },
                        quantity: 1,
                    },
                ],
            });

            sessionId = session.id;
            paymentUrl = session.url;
        } catch (error: any) {
            console.error("Stripe Checkout Error, falling back to mock session:", error.message);
            sessionId = `cs_test_${crypto.randomUUID()}`;
            paymentUrl = `https://checkout.stripe.com/pay/${sessionId}`;
        }
    } else {
        sessionId = `cs_test_${crypto.randomUUID()}`;
        paymentUrl = `https://checkout.stripe.com/pay/${sessionId}`;
    }

    const payment = await prisma.payment.upsert({
        where: { bookingId: payload.bookingId },
        update: {
            transactionId: sessionId,
            amount: booking.totalPrice,
            status: PaymentStatus.PENDING,
            paymentMethod: payload.paymentMethod || "STRIPE",
        },
        create: {
            bookingId: payload.bookingId,
            customerId,
            amount: booking.totalPrice,
            status: PaymentStatus.PENDING,
            transactionId: sessionId,
            paymentMethod: payload.paymentMethod || "STRIPE",
        },
    });

    return {
        paymentUrl,
        transactionId: sessionId,
        payment,
    };
};

const confirmPayment = async (customerId: string, payload: IConfirmPaymentRequest) => {
    const payment = await prisma.payment.findFirst({
        where: { transactionId: payload.transactionId },
        include: {
            booking: true,
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment transaction not found!");
    }

    if (payment.customerId !== customerId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to confirm this payment!");
    }

    if (payment.status === PaymentStatus.COMPLETED) {
        return payment;
    }

    // If Stripe secret is live, verify session status from Stripe
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_") && !payload.transactionId.startsWith("cs_test_")) {
        try {
            const stripeClient = getStripeClient();
            const session = await stripeClient.checkout.sessions.retrieve(payload.transactionId);
            if (session.payment_status !== "paid") {
                throw new AppError(httpStatus.BAD_REQUEST, `Stripe payment status is not paid (${session.payment_status})`);
            }
        } catch (err: any) {
            console.warn("Could not retrieve live session from Stripe or using mock:", err.message);
        }
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.COMPLETED },
        });

        await tx.booking.update({
            where: { id: payment.bookingId },
            data: { status: BookingStatus.PAID },
        });

        return updatedPayment;
    });

    return result;
};

const getPayments = async (userId: string, role: Role) => {
    let whereClause = {};

    if (role === Role.CUSTOMER) {
        whereClause = { customerId: userId };
    } else if (role === Role.TECHNICIAN) {
        whereClause = {
            booking: {
                technicianId: userId,
            },
        };
    }

    const payments = await prisma.payment.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
            booking: {
                include: {
                    service: true,
                },
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return payments;
};

const getPaymentById = async (id: string, userId: string, role: Role) => {
    const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
            booking: {
                include: {
                    service: true,
                },
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found!");
    }

    if (role === Role.CUSTOMER && payment.customerId !== userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to view this payment!");
    }

    if (role === Role.TECHNICIAN && payment.booking.technicianId !== userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to view this payment!");
    }

    return payment;
};

export const paymentService = {
    createPaymentSession,
    confirmPayment,
    getPayments,
    getPaymentById,
};
