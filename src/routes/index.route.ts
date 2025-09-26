import { Router } from "express";
import authRouter from "./auth.route.ts";
import productsRouter from "./products.route.ts";

const indexRouter: Router = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/products", productsRouter);

export default indexRouter;
