import { Schema, model } from "mongoose";
import type { IProduct } from "../types/products.types.ts";

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    },
    { timestamps: true },
);

// creating a text index for searching
productSchema.index({ name: "text" });

export default model<IProduct>("Product", productSchema);
