import { Router } from "express";
import authRouter from "./auth.route.ts";
import productsRouter from "./products.route.ts";
import usersRouter from "./users.route.ts";
import cartsRouter from "./carts.route.ts";
import categoriesRouter from "./categories.route.ts";

const indexRouter: Router = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/users", usersRouter);
indexRouter.use("/products", productsRouter);
indexRouter.use("/carts", cartsRouter);
indexRouter.use("/categories", categoriesRouter);

export default indexRouter;
