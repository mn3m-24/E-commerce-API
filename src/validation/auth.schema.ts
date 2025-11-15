import { z } from "zod";

export const refreshSchema = z.object({
    refreshToken: z.string().min(1),
});

export const accessPayloadSchema = z.looseObject({
    sub: z.string(),
    role: z.enum(["admin", "customer"]),
});

export const refreshPayloadSchema = z.looseObject({
    sub: z.string(),
    jti: z.string(),
    fam: z.string(),
    iat: z.number(),
});
