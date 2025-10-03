import { Types, Document } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    passwordHash: string;
    role: "customer" | "admin";
    createdAt: Date;
    updatedAt: Date;
}
