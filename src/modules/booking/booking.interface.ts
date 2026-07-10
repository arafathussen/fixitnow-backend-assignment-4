import { BookingStatus } from "../../../generated/prisma/client";

export interface ICreateBooking {
    serviceId: string;
    technicianId: string;
    bookingDate: string;
    address: string;
    notes?: string;
}

export interface IUpdateBookingStatus {
    status: BookingStatus;
}

export interface IBookingFilterRequest {
    status?: string;
    page?: number;
    limit?: number;
}
