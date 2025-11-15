import type { JWTPayload } from "jose";

export type UserRole = "admin" | "customer";

export interface AccessPayload extends JWTPayload {
    sub: string;
    role: UserRole;
}

export interface RefreshPayload extends JWTPayload {
    fam: string;
}
