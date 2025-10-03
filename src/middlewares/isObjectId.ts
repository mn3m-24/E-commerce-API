import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

export default (paramName: string = "id") =>
    (req: Request, res: Response, next: NextFunction) =>
        isValidObjectId(req.params[paramName])
            ? next()
            : res.status(400).json({ message: `Invalid ${paramName} format` });
