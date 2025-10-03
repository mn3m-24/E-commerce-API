import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const addItemSchema = z.strictObject({
    productId: z.string().refine((value) => isValidObjectId(value)),
    quantity: z.number().min(0, "Quantity Can't be negative"),
});

export const updateItemQuantitySchema = addItemSchema.omit({
    productId: true,
});
