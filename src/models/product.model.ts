import { Schema, model, type ObjectId, type Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    stock: number;
    category: ObjectId;
}

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

export default model<IProduct>("Product", productSchema);
