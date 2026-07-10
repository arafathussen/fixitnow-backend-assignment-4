import express from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { technicianController } from "./technician.controller";
import { technicianValidation } from "./technician.validation";

const managementRouter = express.Router();
const publicRouter = express.Router();

// 1. Private Technician Management Routes (/api/technician)
managementRouter.get(
    "/profile",
    auth(Role.TECHNICIAN),
    technicianController.getMyProfile
);

managementRouter.put(
    "/profile",
    auth(Role.TECHNICIAN),
    validateRequest(technicianValidation.updateProfileSchema),
    technicianController.updateMyProfile
);

managementRouter.patch(
    "/profile",
    auth(Role.TECHNICIAN),
    validateRequest(technicianValidation.updateProfileSchema),
    technicianController.updateMyProfile
);

managementRouter.get(
    "/availability",
    auth(Role.TECHNICIAN),
    technicianController.getMyAvailability
);

managementRouter.put(
    "/availability",
    auth(Role.TECHNICIAN),
    validateRequest(technicianValidation.updateProfileSchema),
    technicianController.updateMyProfile
);

managementRouter.patch(
    "/availability",
    auth(Role.TECHNICIAN),
    validateRequest(technicianValidation.updateProfileSchema),
    technicianController.updateMyProfile
);

// 2. Public Technician Routes (/api/technicians)
publicRouter.get(
    "/",
    technicianController.getAllTechnicians
);

publicRouter.get(
    "/:id",
    technicianController.getTechnicianById
);

// Backward compatibility alias for plural profile updates (/api/technicians/profile)
publicRouter.patch(
    "/profile",
    auth(Role.TECHNICIAN),
    validateRequest(technicianValidation.updateProfileSchema),
    technicianController.updateMyProfile
);

publicRouter.put(
    "/profile",
    auth(Role.TECHNICIAN),
    validateRequest(technicianValidation.updateProfileSchema),
    technicianController.updateMyProfile
);

export const technicianManagementRoutes = managementRouter;
export const technicianPublicRoutes = publicRouter;
export const technicianRoutes = publicRouter; // Default export alias
