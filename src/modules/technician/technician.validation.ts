import { z } from "zod";

const updateProfileSchema = z.object({
    body: z.object({
        bio: z.string().min(10, "Bio must be at least 10 characters").optional(),
        experienceYears: z.number().nonnegative("Experience years must be 0 or more").optional(),
        hourlyRate: z.number().positive("Hourly rate must be positive").optional(),
        isAvailable: z.boolean().optional(),
    }),
});

export const technicianValidation = {
    updateProfileSchema,
};
