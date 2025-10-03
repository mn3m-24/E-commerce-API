import { Schema, model } from "mongoose";
import type { IUser } from "../types/users.types.ts";

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
    },
    { timestamps: true },
);

export default model<IUser>("User", userSchema);
