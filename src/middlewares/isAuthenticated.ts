import type { RequestHandler } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { verifyAccessToken } from "../utils/jwt.utils.ts";

export const isAuthenticated: RequestHandler = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyAccessToken(token as string) as JwtPayload;
        req.userId = decoded.userId;
        return next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Unauthorized" });
    }
};
