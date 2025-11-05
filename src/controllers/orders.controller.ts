import type { Request, Response } from "express";
import OrderService from "../services/orders.service.ts";

export async function getOrder(req: Request, res: Response) {
    try {
        const userId = req.user.role === "admin" ? null : req.user.sub;
        const order = await OrderService.getOrderById(req.params.id!, userId);
        return res.status(200).json({ order });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(404).json({ message: (err as Error).message });
    }
}

export async function getMyOrders(req: Request, res: Response) {
    try {
        const myOrders = await OrderService.getOrdersByUser(
            req.user.sub,
            req.query,
        );
        return res.status(200).json({ myOrders });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(500).json({ message: (err as Error).message });
    }
}

export async function postOrder(req: Request, res: Response) {
    try {
        const { shippingAddress } = req.body;
        const order = await OrderService.createOrder(
            req.user.sub,
            shippingAddress,
        );
        return res.status(201).json({ order });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(400).json({ message: (err as Error).message });
    }
}

export async function cancelOrder(req: Request, res: Response) {
    try {
        const order = await OrderService.cancelOrder(
            req.params.id!,
            req.user.sub,
        );
        return res.status(200).json({ order });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(400).json({ message: (err as Error).message });
    }
}

export async function getAllOrders(req: Request, res: Response) {
    try {
        const orders = await OrderService.getAllOrders(req.query);
        return res.status(200).json({ orders });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(500).json({ message: (err as Error).message });
    }
}

export async function updateOrderStatus(req: Request, res: Response) {
    try {
        const order = await OrderService.updateOrderStatus(
            req.params.id!,
            req.body.status,
        );
        return res.status(200).json({ order });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(400).json({ message: (err as Error).message });
    }
}
