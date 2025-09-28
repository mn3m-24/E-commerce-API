import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

export default (req: Request, res: Response, next: NextFunction) =>
    isValidObjectId(req.params.id)
        ? next()
        : res.status(400).json({ message: "Invalid Id path param" });
