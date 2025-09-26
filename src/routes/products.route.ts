import { Router } from "express";
import { getProducts } from "../controllers/products.controller.ts";
import { isAuthenticated } from "../middlewares/isAuthenticated.ts";

const productsRouter: Router = Router();

productsRouter.route("/").get(isAuthenticated, getProducts);

export default productsRouter;
