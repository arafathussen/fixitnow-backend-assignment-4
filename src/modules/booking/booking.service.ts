import httpStatus from "http-status";
import { BookingStatus, Role } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateBooking, IUpdateBookingStatus } from "./booking.interface";

const createBooking = async (customerId: string, payload: ICreateBooking) => {
    const service = await prisma.service.findUnique({
        where: { id: payload.serviceId },
    });

    if (!service) {
        throw new AppError(httpStatus.NOT_FOUND, "Service not found!");
    }

    const technician = await prisma.user.findFirst({
        where: {
            OR: [
                { id: payload.technicianId, role: Role.TECHNICIAN },
                { technicianProfile: { id: payload.technicianId } },
            ],
        },
    });

    if (!technician) {
        throw new AppError(httpStatus.NOT_FOUND, "Technician not found!");
    }

    const booking = await prisma.booking.create({
        data: {
            customerId,
            serviceId: payload.serviceId,
            technicianId: technician.id,
            bookingDate: new Date(payload.bookingDate),
            address: payload.address,
            notes: payload.notes || null,
            totalPrice: service.price,
            status: BookingStatus.REQUESTED,
        },
        include: {
            service: {
                include: {
                    category: true,
                },
            },
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
    });

    return { ...booking, bookingId: booking.id };
};

const getCustomerBookings = async (customerId: string) => {
    const bookings = await prisma.booking.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
        include: {
            service: {
                include: {
                    category: true,
                },
            },
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
        },
    });

    return bookings.map(b => ({ ...b, bookingId: b.id }));
};

const getTechnicianBookings = async (technicianId: string) => {
    const technicianUser = await prisma.user.findFirst({
        where: {
            OR: [
                { id: technicianId },
                { technicianProfile: { id: technicianId } },
            ],
        },
    });
    const targetId = technicianUser ? technicianUser.id : technicianId;

    const bookings = await prisma.booking.findMany({
        where: { technicianId: targetId },
        orderBy: { createdAt: "desc" },
        include: {
            service: {
                include: {
                    category: true,
                },
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
        },
    });

    return bookings.map(b => ({ ...b, bookingId: b.id }));
};

const getAllBookingsAdmin = async () => {
    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            service: {
                include: {
                    category: true,
                },
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
    });

    return bookings.map(b => ({ ...b, bookingId: b.id }));
};

const getBookingById = async (bookingId: string, userId: string, role: Role) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            service: {
                include: {
                    category: true,
                },
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
        },
    });

    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
    }

    if (role !== Role.ADMIN && booking.customerId !== userId && booking.technicianId !== userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to view this booking!");
    }

    return { ...booking, bookingId: booking.id };
};

const updateBookingStatus = async (bookingId: string, technicianId: string, payload: IUpdateBookingStatus) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
    }

    const technicianUser = await prisma.user.findFirst({
        where: {
            OR: [
                { id: technicianId },
                { technicianProfile: { id: technicianId } },
            ],
        },
    });
    const targetId = technicianUser ? technicianUser.id : technicianId;

    if (booking.technicianId !== targetId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to update this booking!");
    }

    // State Machine transitions verification
    const currentStatus = booking.status;
    const targetStatus = payload.status;

    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
        [BookingStatus.REQUESTED]: [BookingStatus.ACCEPTED, BookingStatus.DECLINED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.CANCELLED],
        [BookingStatus.ACCEPTED]: [BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.DECLINED, BookingStatus.CANCELLED],
        [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED, BookingStatus.DECLINED],
        [BookingStatus.DECLINED]: [BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.CANCELLED],
        [BookingStatus.COMPLETED]: [],
        [BookingStatus.PAID]: [BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.CANCELLED],
        [BookingStatus.CANCELLED]: [BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED],
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Invalid status transition from ${currentStatus} to ${targetStatus}`
        );
    }

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: targetStatus },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
    });

    return { ...updatedBooking, bookingId: updatedBooking.id };
};

const cancelBooking = async (customerId: string, bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, "Booking not found!");
    }

    if (booking.customerId !== customerId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to cancel this booking!");
    }

    if (booking.status === BookingStatus.IN_PROGRESS || booking.status === BookingStatus.COMPLETED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Cannot cancel a booking that is already in progress or completed!"
        );
    }

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
        include: {
            service: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
        },
    });

    return { ...updatedBooking, bookingId: updatedBooking.id };
};

export const bookingService = {
    createBooking,
    getCustomerBookings,
    getTechnicianBookings,
    getAllBookingsAdmin,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
};
