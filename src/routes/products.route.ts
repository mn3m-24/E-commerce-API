import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.ts";
import authorizeRoles from "../middlewares/authorizeRole.ts";
import isObjectId from "../middlewares/isObjectId.ts";
import validate from "../middlewares/validateSchema.ts";
import { productSchema } from "../validation/products.schema.ts";
import {
    getProducts,
    getProduct,
    postProduct,
    patchProduct,
    deleteProduct,
} from "../controllers/products.controller.ts";

const productsRouter: Router = Router().use(isAuthenticated);

productsRouter
    .route("/")
    .get(getProducts)
    .post(
        authorizeRoles("admin"),
        validate(productSchema, "body"),
        postProduct,
    );

productsRouter
    .route("/:id")
    .all(isObjectId)
    .get(getProduct)
    .patch(
        authorizeRoles("admin"),
        validate(productSchema.partial(), "body"),
        patchProduct,
    )
    .delete(authorizeRoles("admin"), deleteProduct);

export default productsRouter;
