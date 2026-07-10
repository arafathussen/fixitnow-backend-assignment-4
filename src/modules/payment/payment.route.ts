import express from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = express.Router();

router.post(
    "/create",
    auth(Role.CUSTOMER),
    validateRequest(paymentValidation.createPaymentSchema),
    paymentController.createPaymentSession
);

router.post(
    "/confirm",
    auth(Role.CUSTOMER),
    validateRequest(paymentValidation.confirmPaymentSchema),
    paymentController.confirmPayment
);

router.get(
    "/",
    auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
    paymentController.getPayments
);

router.get(
    "/success",
    paymentController.handlePaymentSuccess
);

router.get(
    "/cancel",
    paymentController.handlePaymentCancel
);

router.get(
    "/:id",
    auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
    paymentController.getPaymentById
);

export const paymentRoutes = router;
