import { Schema, model, Document, Types } from "mongoose";

export interface IRfreshToken extends Document {
    tokenHash: string;
    userId: Types.ObjectId;
    jti: string;
    revoked: boolean;
    replacedBy?: Types.ObjectId;
    familyId: string;
    expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRfreshToken>(
    {
        tokenHash: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        jti: { type: String, required: true },
        revoked: { type: Boolean, default: false },
        replacedBy: { type: Schema.Types.ObjectId, ref: "RefreshToken" },
        familyId: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true },
);

export default model<IRfreshToken>("RefreshToken", refreshTokenSchema);
