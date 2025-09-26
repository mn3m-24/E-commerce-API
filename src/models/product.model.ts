import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        inventory: { type: Number, required: true },
    },
    { timestamps: true },
);

export default model("Product", productSchema);
