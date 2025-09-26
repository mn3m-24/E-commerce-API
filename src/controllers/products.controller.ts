import type { RequestHandler } from "express";
import { getAllProducts } from "../services/prodcuts.service.ts";

export const getProducts: RequestHandler = async (req, res) => {
    try {
        const products = await getAllProducts();
        return res.status(200).json(products);
    } catch (err) {
        console.error((err as Error).message);
        return res.status(500).json({ error: "Server error" });
    }
};
