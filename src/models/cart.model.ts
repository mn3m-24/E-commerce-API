import { Schema, model } from "mongoose";
import type { ICart, ICartItem } from "../types/carts.types.ts";

const cartItemSchema = new Schema<ICartItem>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            unique: true,
        },
        quantity: { type: Number, required: true },
    },
    { _id: false },
);

const cartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true },
);

export default model<ICart>("Cart", cartSchema);
