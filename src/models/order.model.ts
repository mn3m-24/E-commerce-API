import { Schema, model } from "mongoose";
import type { IOrder, IOrderItem } from "../types/orders.types.ts";

const orderItemSchema = new Schema<IOrderItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        items: [orderItemSchema],
        totalPrice: { type: Number, required: true },
        shippingAddress: String,
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentId: { type: String, ref: "Payment" },
    },
    { timestamps: true },
);

export default model<IOrder>("Order", orderSchema);
