import { Schema, model } from "mongoose";
import type { ICategory } from "../types/categories.types.ts";

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true },
);

// creating a text index for searching
categorySchema.index({ name: "text", description: "text" });

export default model<ICategory>("Category", categorySchema);
