import Cart from "../models/cart.model.ts";
import Product from "../models/product.model.ts";
import { Types } from "mongoose";

export default class CartService {
    static async get(userId: string, { populate = false } = {}) {
        const cart = await this.findOneOrCreate(userId);
        if (populate) cart.populate("items.productId");
        return cart.toObject();
    }

    static async clear(userId: string) {
        return await Cart.findOneAndDelete({
            userId: new Types.ObjectId(userId),
        }).lean();
    }

    static async updateQuantity(
        userId: string,
        productId: string,
        newQuantity: number,
    ) {
        if (newQuantity === 0) return this.removeItem(userId, productId);
        const pid = new Types.ObjectId(productId);
        const product = await Product.findById(pid);
        if (!product) throw new Error("Product doesn't exist");
        if (newQuantity > product.stock)
            throw new Error(
                "Can't have quantity that is greater than the stock",
            );

        // updating item's quantity (creating and updating if cart doesn't exist)
        const cart = await this.findOneOrCreate(userId);
        const doc = cart.items.find((item) =>
            pid.equals(item.productId as Types.ObjectId),
        );

        if (!doc) cart.items.push({ productId: pid, quantity: newQuantity });
        else doc.quantity = newQuantity;

        return (await cart.save()).toObject();
    }

    static async addItem(
        userId: string,
        { productId, quantity }: { productId: string; quantity: number },
    ) {
        const cart = await CartService.findOneOrCreate(userId);
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product doesn't exist");

        const doc = cart.items.find(
            (d) => d.productId._id.toString() == productId,
        );

        if (!doc && quantity <= product.stock) {
            cart.items.push({ productId: product._id, quantity });
            return await cart.save();
        } else if (doc && doc.quantity + quantity <= product.stock) {
            doc.quantity += quantity;
            return await cart.save();
        }
        throw new Error("Product's stock is Insufficent"); // (doc.quantity + quantity > product.stock) || (quantity > product.stock)
    }

    static async removeItem(userId: string, productId: string) {
        const cart = await Cart.findOneAndUpdate(
            { userId: new Types.ObjectId(userId) },
            { $pull: { items: { productId: new Types.ObjectId(productId) } } },
            { new: true },
        );
        if (!cart) throw new Error("Cart doesn't exist"); // throw error if cart doesn't exist
        if (cart.items.length === 0) await cart.deleteOne(); // delete cart if empty
        return cart.toObject();
    }

    private static async findOneOrCreate(userId: string) {
        return await Cart.findOneAndUpdate(
            { userId: new Types.ObjectId(userId) },
            { $setOnInsert: { items: [] } },
            { new: true, upsert: true },
        );
    }
}
