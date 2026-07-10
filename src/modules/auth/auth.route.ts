import express from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router = express.Router();

router.post(
    "/register",
    validateRequest(authValidation.registerSchema),
    authController.register
);

router.post(
    "/login",
    validateRequest(authValidation.loginSchema),
    authController.login
);

router.get(
    "/me",
    auth(),
    authController.getMe
);

export const authRoutes = router;
