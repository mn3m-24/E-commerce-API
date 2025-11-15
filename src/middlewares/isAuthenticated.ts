import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils.ts";

export default async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = await verifyAccessToken(token!);
        req.user = decoded;
        return next();
    } catch (err) {
        console.error("Token verification failed:", (err as Error).message);
        return res.status(401).json({ error: "Unauthorized" });
    }
};
