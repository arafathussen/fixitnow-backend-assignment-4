import express from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = express.Router();

router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(categoryValidation.createCategorySchema),
    categoryController.createCategory
);

router.get(
    "/",
    categoryController.getAllCategories
);

router.get(
    "/:id",
    categoryController.getCategoryById
);

export const categoryRoutes = router;
