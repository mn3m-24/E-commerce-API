import { Types } from "mongoose";
import Order from "../models/order.model.ts";
import Product from "../models/product.model.ts";
import CartService from "./carts.service.ts";
import APIFeatures from "./features.service.ts";
import type { IOrderItem, OrderStatus } from "../types/orders.types.ts";
import type { IProduct } from "../types/products.types.ts";

export default class OrderService {
    private static readonly VALID_STATUS_TRANSITIONS: Record<string, string[]> =
        {
            pending: ["paid", "cancelled"],
            paid: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: [],
        };
    private static readonly NON_CANCELLABLE_STATUSES: string[] = [
        "shipped",
        "delivered",
        "cancelled",
    ];
    static async createOrder(userId: string, shippingAddress: string) {
        const { items } = await CartService.get(userId, { populate: true });
        if (items.length === 0) throw new Error("Cart is empty");

        // check stock & create order's items & reduce the stock of products
        const orderItems: IOrderItem[] = [];
        for (const item of items) {
            const product = item.productId as IProduct;
            // update stock if sufficient
            const updated = await Product.findOneAndUpdate(
                { _id: product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true },
            );
            // checking stock sufficiency
            if (!updated)
                throw new Error(`Insufficient stock for ${product.name}`);
            // creating the orderItems
            orderItems.push({
                product: updated._id,
                quantity: item.quantity,
                priceAtPurchase: updated.price,
            });
        }
        // create new order
        const order = await Order.create({
            userId: new Types.ObjectId(userId),
            items: orderItems,
            totalPrice: orderItems.reduce(
                (sum, item) => sum + item.priceAtPurchase * item.quantity,
                0,
            ),
            shippingAddress,
        });
        // clear the cart after checkout
        await CartService.clear(userId);
        return order.toObject();
    }

    static async getOrderById(orderId: string, userId: string | null) {
        type QType = { _id: Types.ObjectId; userId?: Types.ObjectId };
        const query: QType = {
            _id: new Types.ObjectId(orderId),
        };
        if (userId) query.userId = new Types.ObjectId(userId);
        const order = await Order.findOne(query)
            .populate("items.product", "name price")
            .lean();
        if (!order) throw new Error("Order doesn't exist");

        return order;
    }

    static async cancelOrder(orderId: string, userId: string) {
        const order = await Order.findOne({
            _id: new Types.ObjectId(orderId),
            userId,
        });
        if (!order) throw new Error("Order not found or unauthorized");
        if (this.NON_CANCELLABLE_STATUSES.includes(order.status))
            throw new Error("Order can't be cancelled");

        // restore stock for each item using bulkWrite to send only one req to the db
        await this.restoreStock(order.items);

        order.status = "cancelled";
        await order.save();
        return order.toObject();
    }

    static async getOrdersByUser(
        userId: string,
        queryStr: Record<string, any>,
    ) {
        return await new APIFeatures(
            Order.find({ userId: new Types.ObjectId(userId) }).populate(
                "items.product",
                "name price",
            ),
            queryStr,
        )
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .search()
            .query.lean();
    }

    static async getAllOrders(queryStr: Record<string, any>) {
        return await new APIFeatures(
            Order.find().populate("items.product", "name price"),
            queryStr,
        )
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .search()
            .query.lean();
    }

    static async updateOrderStatus(orderId: string, status: OrderStatus) {
        const order = await Order.findById(new Types.ObjectId(orderId));
        if (!order) throw new Error("Order doesn't exist");

        const validNextStatus = this.VALID_STATUS_TRANSITIONS[order.status];

        if (!validNextStatus.includes(status))
            throw new Error(
                `Cannot change status from ${order.status} to ${status}`,
            );

        if (status === "cancelled") await this.restoreStock(order.items); // handling cancelling

        order.status = status;
        await order.save();
        return order.toObject();
    }

    private static async restoreStock(items: IOrderItem[]) {
        await Product.bulkWrite(
            items.map((item) => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { stock: item.quantity } },
                },
            })),
        );
    }
}
