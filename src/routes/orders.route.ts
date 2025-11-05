import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.ts";
import authorizeRole from "../middlewares/authorizeRole.ts";
import isObjectId from "../middlewares/isObjectId.ts";
import validate from "../middlewares/validateSchema.ts";
import {
    cancelOrder,
    getAllOrders,
    getMyOrders,
    getOrder,
    postOrder,
    updateOrderStatus,
} from "../controllers/orders.controller.ts";
import {
    orderSchema,
    orderUpdateStatusSchema,
} from "../validation/orders.schema.ts";

const ordersRouter: Router = Router().use(isAuthenticated);

ordersRouter
    .route("/")
    .get(authorizeRole("admin"), getAllOrders)
    .post(validate(orderSchema, "body"), postOrder);

ordersRouter.get("/me", getMyOrders);

ordersRouter.route("/:id").all(isObjectId()).get(getOrder).patch(cancelOrder);

ordersRouter.patch(
    "/:id/status",
    isObjectId(),
    authorizeRole("admin"),
    validate(orderUpdateStatusSchema, "body"),
    updateOrderStatus,
);

export default ordersRouter;
