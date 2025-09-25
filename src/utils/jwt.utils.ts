import config from "../config/config.ts";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

export const signAccessToken = (payload: object) =>
    jwt.sign(payload, config.accessSecret, {
        expiresIn: config.accessTTL,
    });

export const verifyAccessToken = (token: string) =>
    jwt.verify(token, config.accessSecret);

export const signRefreshToken = (payload: object) =>
    jwt.sign(payload, config.refreshSecret, {
        expiresIn: config.refreshTTL,
    });

export const verifyRefreshToken = (token: string) =>
    jwt.verify(token, config.refreshSecret);

export const generateRefreshTokenPayload = (
    userId: string,
    familyId: string,
) => {
    return { sub: userId, jti: randomUUID(), fam: familyId, iat: Date.now() };
};
