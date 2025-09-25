import { Router } from "express";
import authRouter from "./auth.route.ts";

const indexRouter: Router = Router();

indexRouter.use("/auth", authRouter);

export default indexRouter;
