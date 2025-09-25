import { z, ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export default function validate(
    schema: ZodType,
    source: "body" | "params" | "query" | "cookies",
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req[source]);
        if (!parsed.success)
            return res.status(400).json({
                message: "Validation error",
                issues: parsed.error.issues,
            });
        next();
    };
}
