import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: "customer" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

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
