import { z } from "zod";

export const registerSchema = z.strictObject({
    email: z.string().email(),
    password: z.string().min(8, "Password Can't be less than 8 chars"),
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1),
});
