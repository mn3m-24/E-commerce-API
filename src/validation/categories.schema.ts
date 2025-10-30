import { z } from "zod";

export const categoryBodySchema = z.strictObject({
    name: z.string().min(2, "Name can't be less than two chars"),
    description: z.string().min(10, "Description can't be less than 10 chars"),
});
