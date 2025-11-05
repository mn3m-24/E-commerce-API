import { z } from "zod";

export const orderSchema = z.strictObject({
    shippingAddress: z
        .string()
        .min(10, "Shipping address Can't be less than 10 characters"),
});
export const orderUpdateStatusSchema = z.strictObject({
    status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
});
