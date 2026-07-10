import { z } from "zod";

const createCategorySchema = z.object({
    body: z.object({
        name: z.string({
            message: "Category name is required",
        }).min(2, "Category name must be at least 2 characters"),
        description: z.string().optional(),
    }),
});

export const categoryValidation = {
    createCategorySchema,
};
