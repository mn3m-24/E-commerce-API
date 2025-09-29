import { z } from "zod";

export const userSchema = z.strictObject({
    email: z.string().email(),
    password: z.string().min(8, "Password Can't be less than 8 chars"),
});
