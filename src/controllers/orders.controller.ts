import type { Request, Response } from "express";
import OrderService from "../services/order.service.ts";

export async function getOrder(req: Request, res: Response) {
    try {
        const order = await OrderService.getOrderById(req.params.orderId!);
        return res.status(200).json({ order });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(404).json({ message: (err as Error).message });
    }
}

export async function getMyOrders(req: Request, res: Response) {
    try {
        const myOrders = await OrderService.getOrdersByUser(req.user.sub);
        return res.status(200).json({ myOrders });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(500).json({ message: (err as Error).message });
    }
}

export async function postOrder(req: Request, res: Response) {
    try {
        const order = await OrderService.createOrder(req.user.sub);
        return res.status(201).json({ order });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(400).json({ message: (err as Error).message });
    }
}

export async function cancelOrder(req: Request, res: Response) {
    try {
        const order = await OrderService.cancelOrder(
            req.params.orderId!,
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
        const orders = await OrderService.getAllOrders();
        return res.status(200).json({ orders });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(500).json({ message: (err as Error).message });
    }
}

export async function updateOrderStatus(req: Request, res: Response) {
    try {
        const order = await OrderService.updateOrderStatus(
            req.params.orderId!,
            req.body.status,
        );
        return res.status(200).json({ order });
    } catch (err) {
        console.error((err as Error).message);
        return res.status(400).json({ message: (err as Error).message });
    }
}
