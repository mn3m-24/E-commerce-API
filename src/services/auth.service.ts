import config from "../config/config.ts";
import { randomUUID } from "node:crypto";
import RefreshToken from "../models/refreshToken.model.ts";
import type { IRfreshToken } from "../types/refreshTokens.types.ts";
import { Types } from "mongoose";
import {
    generateRefreshTokenPayload,
    signAccessToken,
    signRefreshToken,
} from "../utils/jwt.utils.ts";
import { hashInput } from "../utils/hash.utils.ts";

export default class AuthService {
    static createAccessToken(sub: string, role: "customer" | "admin") {
        return signAccessToken({ sub, role });
    }

    static async createRefreshToken(
        userId: string,
        toBeReplaced: IRfreshToken | null = null,
    ) {
        const familyId = randomUUID();
        const payload = generateRefreshTokenPayload(userId, familyId);
        const token = signRefreshToken(payload);
        const tokenHash = hashInput(token);

        const dbToken = await RefreshToken.create({
            tokenHash,
            userId: new Types.ObjectId(userId),
            jti: payload.jti,
            familyId,
            expiresAt: Date.now() + config.refreshTTL * 1000,
        });

        // revoke token and add the replacedBy field (if the toBeReplaced field exists)
        if (toBeReplaced) {
            toBeReplaced.replacedBy = dbToken._id;
            toBeReplaced.revoked = true;
            await toBeReplaced.save();
        }

        return token;
    }

    static async revokeFamilyTokens(familyId: string) {
        await RefreshToken.updateMany({ familyId }, { revoked: true });
    }

    static async getFamilyTokens(familyId: string) {
        return RefreshToken.find({ familyId }).sort({ createdAt: -1 });
    }
}
