import config from "../config/config.ts";
import type { AccessPayload, RefreshPayload } from "../types/auth.types.ts";
import { SignJWT, jwtVerify } from "jose";
import {
    accessPayloadSchema,
    refreshPayloadSchema,
} from "../validation/auth.schema.ts";
import { randomUUID } from "node:crypto";

// convert string secrets tot Uint8Array for jose
const accessSecret = new TextEncoder().encode(config.accessSecret),
    refreshSecret = new TextEncoder().encode(config.refreshSecret);

export async function signAccessToken(payload: AccessPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS512" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + config.accessTTL)
        .sign(accessSecret);
}

export async function verifyAccessToken(token: string): Promise<AccessPayload> {
    const { payload } = await jwtVerify(token, accessSecret, {
        algorithms: ["HS512"],
    });
    return accessPayloadSchema.parse(payload);
}

export async function signRefreshToken(
    payload: RefreshPayload,
): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS512" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + config.refreshTTL)
        .sign(refreshSecret);
}

export async function verifyRefreshToken(
    token: string,
): Promise<RefreshPayload> {
    const { payload } = await jwtVerify(token, refreshSecret, {
        algorithms: ["HS512"],
    });
    return refreshPayloadSchema.parse(payload);
}

export function generateRefreshTokenPayload(
    userId: string,
    familyId: string,
): RefreshPayload {
    return {
        sub: userId,
        jti: randomUUID(),
        fam: familyId,
        iat: Math.floor(Date.now() / 1000),
    };
}
