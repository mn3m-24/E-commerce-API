import { Schema, model } from "mongoose";
import type { IRfreshToken } from "../types/refreshTokens.types.ts";

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
