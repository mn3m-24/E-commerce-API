import { Router } from "express";
import validate from "../middlewares/validateSchema.ts";
import {
    addItemSchema,
    updateItemQuantitySchema,
} from "../validation/carts.schema.ts";
import {
    getCart,
    clearCart,
    addItem,
    removeItem,
    updateItemQuantity,
} from "../controllers/carts.controller.ts";
import isAuthenticated from "../middlewares/isAuthenticated.ts";
import isObjectId from "../middlewares/isObjectId.ts";

const cartsRouter: Router = Router().use(isAuthenticated);

cartsRouter.route("/").get(getCart).delete(clearCart);
cartsRouter.post("/items", validate(addItemSchema, "body"), addItem);
cartsRouter
    .route("/items/:productId")
    .all(isObjectId("productId"))
    .patch(validate(updateItemQuantitySchema, "body"), updateItemQuantity)
    .delete(removeItem);

export default cartsRouter;
