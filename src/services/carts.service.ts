import Cart from "../models/cart.model.ts";
import { Types } from "mongoose";

export default class CartService {
    static async fetchCart(userId: string) {
        const uid = new Types.ObjectId(userId);
        return (
            (await Cart.findOne({ userId: uid }).lean()) || {
                userId: uid,
                items: [],
            }
        );
    }

    static async wipeCart(userId: string) {
        const uid = new Types.ObjectId(userId);
        return (
            (await Cart.findOneAndUpdate(
                { userId: uid },
                {
                    $set: { items: [] },
                },
                { new: true },
            ).lean()) || { userId: uid, items: [] }
        );
    }

    static async updateQuantity(
        userId: string,
        productId: string,
        newQuantity: number,
    ) {
        if (newQuantity === 0) return CartService.removeItem(userId, productId);

        const uid = new Types.ObjectId(userId),
            pid = new Types.ObjectId(productId);

        const updated = await Cart.findOneAndUpdate(
            {
                userId: uid,
                "items.productId": pid,
            },
            { $set: { "items.$.quantity": newQuantity } },
            {
                new: true,
            },
        ).lean();
        if (updated) return updated; // return the updated version if cart & product exist

        // if cart exists (which mean that the productId was the one that do not exist before), push item, else return a new cart with item
        return Cart.findOneAndUpdate(
            { userId: uid },
            { $push: { items: { productId: pid, quantity: newQuantity } } },
            {
                upsert: true,
                new: true,
            },
        ).lean();
    }

    static async addItem(
        userId: string,
        item: { productId: string; quantity: number },
    ) {
        const uid = new Types.ObjectId(userId),
            pid = new Types.ObjectId(item.productId);
        const incResult = await Cart.updateOne(
            {
                userId: uid,
                "items.productId": pid,
            },
            { $inc: { "items.$.quantity": item.quantity } },
        );
        // if document updated
        if (incResult.matchedCount > 0) {
            return await Cart.findOne({ userId: uid }).lean();
        }

        return (
            (await Cart.findOneAndUpdate(
                {
                    userId: uid,
                },
                {
                    $push: {
                        items: {
                            productId: pid,
                            quantity: item.quantity,
                        },
                    },
                },
                { upsert: true, new: true },
            ).lean()) || { userId: uid, items: [] }
        );
    }

    static async removeItem(userId: string, productId: string) {
        const uid = new Types.ObjectId(userId),
            pid = new Types.ObjectId(productId);
        return (
            (await Cart.findOneAndUpdate(
                {
                    userId: uid,
                },
                {
                    $pull: {
                        items: { productId: pid },
                    },
                },
                { new: true },
            ).lean()) || { userId: uid, items: [] }
        );
    }
}
