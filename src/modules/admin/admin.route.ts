import express from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminController } from "./admin.controller";
import { adminValidation } from "./admin.validation";

const router = express.Router();

router.get(
    "/users",
    auth(Role.ADMIN),
    adminController.getAllUsersAdmin
);

router.patch(
    "/users/:id",
    auth(Role.ADMIN),
    validateRequest(adminValidation.updateUserBanStatusSchema),
    adminController.updateUserBanStatus
);

export const adminUserRoutes = router;
