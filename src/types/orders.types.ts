import { Types, Document } from "mongoose";

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
    shippingAddress: String;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    paymentId: string;
}
