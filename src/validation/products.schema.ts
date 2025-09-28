import { z } from "zod";

export const productSchema = z.strictObject({
    name: z
        .string()
        .min(2, "Name must be more than 1 letters")
        .max(50, "Name must be less than 51 chars"),
    price: z.number().min(0, "Price can't be negative"),
    category: z.string(),
});
