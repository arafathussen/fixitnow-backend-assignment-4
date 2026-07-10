import express from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { categoryRoutes } from "../modules/category/category.route";
import { serviceRoutes } from "../modules/service/service.route";
import { technicianManagementRoutes, technicianPublicRoutes, technicianRoutes } from "../modules/technician/technician.route";
import { adminBookingRoutes, bookingRoutes, technicianBookingRoutes } from "../modules/booking/booking.route";
import { reviewRoutes } from "../modules/review/review.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { adminUserRoutes } from "../modules/admin/admin.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/categories",
        route: categoryRoutes,
    },
    {
        path: "/services",
        route: serviceRoutes,
    },
    {
        path: "/bookings",
        route: bookingRoutes,
    },
    {
        path: "/technician/bookings",
        route: technicianBookingRoutes,
    },
    {
        path: "/technicians/bookings",
        route: technicianBookingRoutes,
    },
    {
        path: "/technician",
        route: technicianManagementRoutes,
    },
    {
        path: "/technicians",
        route: technicianPublicRoutes,
    },
    {
        path: "/admin/bookings",
        route: adminBookingRoutes,
    },
    {
        path: "/admin/categories",
        route: categoryRoutes,
    },
    {
        path: "/admin",
        route: adminUserRoutes,
    },
    {
        path: "/reviews",
        route: reviewRoutes,
    },
    {
        path: "/payments",
        route: paymentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
