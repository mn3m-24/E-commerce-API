import type { Request, Response, NextFunction } from "express";

export default (...allowableRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.user)
            return res.status(401).json({ message: "Not authenticated" });

        if (!allowableRoles.includes(req.user.role))
            return res
                .status(403)
                .json({ message: "Forbidden: insufficient permissions" });

        return next();
    };
