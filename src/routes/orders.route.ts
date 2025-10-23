import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.ts";
import authorizeRole from "../middlewares/authorizeRole.ts";
import isObjectId from "../middlewares/isObjectId.ts";
import {
    cancelOrder,
    getAllOrders,
    getMyOrders,
    getOrder,
    postOrder,
    updateOrderStatus,
} from "../controllers/orders.controller.ts";

const ordersRouter: Router = Router().use(isAuthenticated);

ordersRouter
    .route("/")
    .get(authorizeRole("admin"), getAllOrders)
    .post(postOrder);

ordersRouter.get("/me", getMyOrders);

ordersRouter
    .route("/:orderId")
    .all(isObjectId("orderId"))
    .get(getOrder)
    .patch(cancelOrder);

ordersRouter.patch(
    "/:orderId/status",
    authorizeRole("admin"),
    updateOrderStatus,
);

export default ordersRouter;
