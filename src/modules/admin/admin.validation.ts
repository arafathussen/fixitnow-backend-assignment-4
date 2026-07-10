import { z } from "zod";

const updateUserBanStatusSchema = z.object({
    body: z.object({
        isBanned: z.boolean({
            message: "isBanned boolean value is required",
        }),
    }),
});

export const adminValidation = {
    updateUserBanStatusSchema,
};
