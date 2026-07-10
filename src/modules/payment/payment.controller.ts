import { Request, Response } from "express";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { prisma } from "../../lib/prisma";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
    const customerId = (req as any).user.id;
    const result = await paymentService.createPaymentSession(customerId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Payment session created successfully",
        data: result,
    });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
    const customerId = (req as any).user.id;
    const result = await paymentService.confirmPayment(customerId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment confirmed successfully",
        data: result,
    });
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const role = (req as any).user.role as Role;
    const result = await paymentService.getPayments(userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments retrieved successfully",
        data: result,
    });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const role = (req as any).user.role as Role;
    const result = await paymentService.getPaymentById(id as string, userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment retrieved successfully",
        data: result,
    });
});

const handlePaymentSuccess = catchAsync(async (req: Request, res: Response) => {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== "string") {
        res.status(400).send("<h3>Invalid or missing payment session ID.</h3>");
        return;
    }

    // Find the payment in the database
    const payment = await prisma.payment.findFirst({
        where: { transactionId: session_id },
        include: {
            booking: {
                include: {
                    service: true,
                    customer: true,
                },
            },
        },
    });

    if (!payment) {
        res.status(404).send("<h3>Payment transaction not found in FixItNow database.</h3>");
        return;
    }

    // Automatically confirm the payment in the database if it is currently pending
    if (payment.status !== "COMPLETED") {
        await prisma.$transaction(async (tx: any) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: { status: "COMPLETED" },
            });
            await tx.booking.update({
                where: { id: payment.bookingId },
                data: { status: "PAID" },
            });
        });
        payment.status = "COMPLETED" as any;
        payment.booking.status = "PAID" as any;
    }

    // Return a beautiful HTML receipt directly to the browser
    const receiptHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt - FixItNow</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f3f4f6;
                margin: 0;
                padding: 40px 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 80vh;
            }
            .receipt-card {
                background: #ffffff;
                max-width: 520px;
                width: 100%;
                border-radius: 16px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
                padding: 36px;
                text-align: center;
            }
            .icon-success {
                width: 68px;
                height: 68px;
                background-color: #10b981;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 36px;
                margin: 0 auto 20px auto;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            h1 {
                color: #111827;
                font-size: 24px;
                margin: 0 0 8px 0;
            }
            p.subtitle {
                color: #6b7280;
                font-size: 15px;
                margin: 0 0 28px 0;
            }
            .details-box {
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                text-align: left;
                margin-bottom: 28px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 14px;
            }
            .detail-row:last-child {
                margin-bottom: 0;
                padding-top: 12px;
                border-top: 1px dashed #d1d5db;
                font-weight: bold;
                font-size: 16px;
                color: #111827;
            }
            .detail-label {
                color: #6b7280;
            }
            .detail-value {
                color: #1f2937;
                font-weight: 600;
            }
            .badge-paid {
                background-color: #d1fae5;
                color: #065f46;
                padding: 4px 12px;
                border-radius: 9999px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .footer-msg {
                font-size: 13px;
                color: #9ca3af;
            }
        </style>
    </head>
    <body>
        <div class="receipt-card">
            <div class="icon-success">✓</div>
            <h1>Payment Successful!</h1>
            <p class="subtitle">Your booking has been confirmed and paid via Stripe.</p>
            
            <div class="details-box">
                <div class="detail-row">
                    <span class="detail-label">Service</span>
                    <span class="detail-value">${payment.booking.service.title}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer</span>
                    <span class="detail-value">${payment.booking.customer.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Transaction ID</span>
                    <span class="detail-value" style="font-size: 12px; word-break: break-all; display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <span>${payment.transactionId}</span>
                        <button onclick="navigator.clipboard.writeText('${payment.transactionId}').then(() => { this.innerText = '✓ Copied!'; this.style.background = '#10b981'; setTimeout(() => { this.innerText = '📋 Copy ID'; this.style.background = '#3b82f6'; }, 2000); })" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; white-space: nowrap; font-weight: 600; transition: all 0.2s;">📋 Copy ID</button>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status</span>
                    <span class="badge-paid">${payment.status}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking Status</span>
                    <span class="badge-paid">${payment.booking.status}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount</span>
                    <span class="detail-value" style="color: #10b981;">$${payment.amount}</span>
                </div>
            </div>

            <p class="footer-msg">FixItNow • Professional Home Services Platform<br>You may now close this window and return to your application.</p>
        </div>
    </body>
    </html>
    `;

    res.status(200).send(receiptHtml);
});

const handlePaymentCancel = catchAsync(async (req: Request, res: Response) => {
    res.status(200).send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #ef4444;">Payment Cancelled</h2>
            <p>You have cancelled the Stripe checkout process. Your booking remains pending.</p>
        </div>
    `);
});

export const paymentController = {
    createPaymentSession,
    confirmPayment,
    getPayments,
    getPaymentById,
    handlePaymentSuccess,
    handlePaymentCancel,
};
