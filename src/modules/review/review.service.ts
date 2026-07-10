import httpStatus from "http-status";
import { BookingStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateReview } from "./review.interface";

const createReview = async (customerId: string, payload: ICreateReview) => {
    const booking = await prisma.booking.findUnique({
        where: { id: payload.bookingId },
    });

    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
    }

    if (booking.customerId !== customerId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You can only review your own bookings!");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can only review completed jobs!");
    }

    const existingReview = await prisma.review.findUnique({
        where: { bookingId: payload.bookingId },
    });

    if (existingReview) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already reviewed this booking!");
    }

    const result = await prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
            data: {
                bookingId: payload.bookingId,
                customerId,
                technicianId: booking.technicianId,
                rating: payload.rating,
                comment: payload.comment || null,
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                technician: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const agg = await tx.review.aggregate({
            where: { technicianId: booking.technicianId },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        const newRating = Number(agg._avg.rating?.toFixed(2)) || payload.rating;
        const newTotalReviews = agg._count.rating || 1;

        // Check if TechnicianProfile exists before updating
        const techProfile = await tx.technicianProfile.findUnique({
            where: { userId: booking.technicianId },
        });

        if (techProfile) {
            await tx.technicianProfile.update({
                where: { userId: booking.technicianId },
                data: {
                    rating: newRating,
                    totalReviews: newTotalReviews,
                },
            });
        }

        return review;
    });

    return result;
};

const getAllReviews = async () => {
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            technician: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return reviews;
};

export const reviewService = {
    createReview,
    getAllReviews,
};
