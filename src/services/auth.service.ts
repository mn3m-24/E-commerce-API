import config from "../config/config.ts";
import RefreshToken, {
    type IRfreshToken,
} from "../models/refreshToken.model.ts";
import { randomUUID } from "node:crypto";
import {
    generateRefreshTokenPayload,
    signAccessToken,
    signRefreshToken,
} from "../utils/jwt.utils.ts";
import { hashInput } from "../utils/hash.utils.ts";

export function createAccessToken(userId: string, role: "customer" | "admin") {
    return signAccessToken({ sub: userId, role });
}

export async function createRefreshToken(
    userId: string,
    toBeReplaced: IRfreshToken | null = null,
) {
    const familyId = randomUUID();
    const payload = generateRefreshTokenPayload(userId, familyId);
    const token = signRefreshToken(payload);
    const tokenHash = hashInput(token);

    const dbToken = await RefreshToken.create({
        tokenHash,
        userId,
        jti: payload.jti,
        familyId,
        expiresAt: Date.now() + config.refreshTTL * 1000,
    });

    // revoke token and add the replacedBy field (if the toBeReplaced field exists)
    if (toBeReplaced) {
        toBeReplaced.replacedBy = dbToken.id;
        toBeReplaced.revoked = true;
        await toBeReplaced.save();
    }

    return token;
}

export async function revokeFamilyTokens(familyId: string) {
    await RefreshToken.updateMany({ familyId }, { revoked: true });
}

export async function getFamilyTokens(familyId: string) {
    return RefreshToken.find({ familyId }).sort({ createdAt: -1 });
}
