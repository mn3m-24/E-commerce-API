import { Types } from "mongoose";
import Order from "../models/order.model.ts";
import type { IProduct } from "../types/products.types.ts";
import CartService from "./carts.service.ts";

export default class OrderService {
    static async createOrder(userId: string) {
        // cart items
        const { items } = await CartService.fetchCart(userId, {
            populate: true,
        });
        if (items.length === 0) throw Error("Cart is empty");
        // items inside the order
        const orderItems = items.map((item) => ({
            product: item.productId._id,
            quantity: item.quantity,
            priceAtPurchase: (item.productId as IProduct).price,
        }));
        // clear the cart after checkout
        await CartService.wipeCart(userId);
        // new order
        return Order.create({
            userId,
            items: orderItems,
            totalPrice: orderItems.reduce(
                (sum, item) => sum + item.priceAtPurchase * item.quantity,
                0,
            ),
        });
    }

    static async getOrderById(orderId: string) {
        const order = await Order.findById(new Types.ObjectId(orderId)).lean();
        if (!order) throw Error("Order doesn't exist");

        return order;
    }

    static async cancelOrder(orderId: string, userId: string) {
        const order = await Order.findById(new Types.ObjectId(orderId));
        if (!order) throw new Error("Order Doesn't exist");
        if (userId !== order.userId.toString())
            throw new Error("Can't remove someone else's order");
        if (!["pending", "paid"].includes(order.status))
            throw new Error("Order can't be cancelled after order");

        order.status = "cancelled";
        await order.save();
        return order.toObject();
    }

    static async getOrdersByUser(userId: string) {
        return Order.find({ userId: new Types.ObjectId(userId) });
    }

    static async getAllOrders() {
        return Order.find();
    }

    static async updateOrderStatus(
        orderId: string,
        status: "pending" | "paid" | "shipped" | "delivered" | "cancelled",
    ) {
        if (
            !["pending", "paid", "shipped", "delivered", "cancelled"].includes(
                status,
            )
        )
            throw new Error("Invalid status");

        const order = await Order.findById(new Types.ObjectId(orderId));
        if (!order) throw new Error("Order doesn't exist");

        order.status = status;
        await order.save();
        return order.toObject();
    }
}
