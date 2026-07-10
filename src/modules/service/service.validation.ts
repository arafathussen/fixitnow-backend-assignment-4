import { z } from "zod";

const createServiceSchema = z.object({
    body: z.object({
        title: z.string({
            message: "Service title is required",
        }).min(2, "Service title must be at least 2 characters"),
        description: z.string({
            message: "Description is required",
        }).min(10, "Description must be at least 10 characters"),
        price: z.number({
            message: "Price must be a number",
        }).positive("Price must be positive"),
        duration: z.number().positive("Duration must be positive"),
        categoryId: z.string({
            message: "Category ID is required",
        }),
        technicianId: z.string({
            message: "Technician ID is required",
        }),
    }),
});

const updateServiceSchema = z.object({
    body: z.object({
        title: z.string().min(2).optional(),
        description: z.string().min(10).optional(),
        price: z.number().positive().optional(),
        duration: z.number().positive().optional(),
        categoryId: z.string().optional(),
        technicianId: z.string().optional(),
    }),
});

export const serviceValidation = {
    createServiceSchema,
    updateServiceSchema,
};
