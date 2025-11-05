import { Schema, model } from "mongoose";
import type { IOrder, IOrderItem } from "../types/orders.types.ts";

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
        },
        priceAtPurchase: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"],
        },
    },
    { _id: false },
);

const orderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        items: [orderItemSchema],
        totalPrice: { type: Number, required: true },
        shippingAddress: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentId: { type: String, ref: "Payment" },
    },
    { timestamps: true },
);
orderSchema.index({ status: "text", shippingAddress: "text" });

export default model<IOrder>("Order", orderSchema);
