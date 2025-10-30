import type { RequestHandler } from "express";
import CartService from "../services/carts.service.ts";

export const getCart: RequestHandler = async (req, res) => {
    const cart = await CartService.get(req.user.sub);
    return res.status(200).json(cart);
};

export const clearCart: RequestHandler = async (req, res) => {
    const result = await CartService.clear(req.user.sub);
    return res
        .status(200)
        .json({ message: "Cart removed Successfully", result });
};

export const updateItemQuantity: RequestHandler = async (req, res) => {
    const result = await CartService.updateQuantity(
        req.user.sub,
        req.params.productId!,
        req.body.quantity,
    );
    return res
        .status(200)
        .json({ message: "Prodcut in the cart updated successfully!", result });
};

export const addItem: RequestHandler = async (req, res) => {
    try {
        const result = await CartService.addItem(req.user.sub, req.body);
        return res
            .status(200)
            .json({ message: "Item added Successfully", result });
    } catch (err) {
        console.error((err as Error).message);
        return res
            .status(400)
            .json({ status: "fail", data: { title: (err as Error).message } });
    }
};

export const removeItem: RequestHandler = async (req, res) => {
    const result = await CartService.removeItem(
        req.user.sub,
        req.params.productId!,
    );
    return res
        .status(200)
        .json({ message: "Item removed Successfully", result });
};
