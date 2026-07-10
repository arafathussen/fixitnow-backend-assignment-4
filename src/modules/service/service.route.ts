import express from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceController } from "./service.controller";
import { serviceValidation } from "./service.validation";

const router = express.Router();

router.post(
    "/",
    auth(Role.ADMIN, Role.TECHNICIAN),
    validateRequest(serviceValidation.createServiceSchema),
    serviceController.createService
);

router.get(
    "/",
    serviceController.getAllServices
);

router.get(
    "/:id",
    serviceController.getServiceById
);

router.patch(
    "/:id",
    auth(Role.ADMIN, Role.TECHNICIAN),
    validateRequest(serviceValidation.updateServiceSchema),
    serviceController.updateService
);

router.delete(
    "/:id",
    auth(Role.ADMIN, Role.TECHNICIAN),
    serviceController.deleteService
);

export const serviceRoutes = router;
