import { Types, Document } from "mongoose";

export type OrderStatus =
    | "pending"
    | "paid"
    | "cancelled"
    | "shipped"
    | "delivered";
export interface IOrderItem {
    product: Types.ObjectId;
    quantity: number;
    priceAtPurchase: number;
}
export interface IOrder extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    shippingAddress: string;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    paymentId: string;
}
