import type { RequestHandler } from "express";
import {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    removeProduct,
} from "../services/products.service.ts";

export const getProducts: RequestHandler = async (req, res) => {
    const products = await fetchProducts();
    return res.status(200).json(products);
};

export const getProduct: RequestHandler = async (req, res) => {
    const product = await fetchProduct(req.params.id!);
    return res.status(200).json(product);
};

export const postProduct: RequestHandler = async (req, res) => {
    const { name, price, category } = req.body;
    const product = await createProduct(name, price, category);
    return res
        .status(201)
        .json({ message: "Product created successfully", product });
};

export const patchProduct: RequestHandler = async (req, res) => {
    const product = await updateProduct(req.params.id!, req.body);
    return res.status(200).json(product);
};

export const deleteProduct: RequestHandler = async (req, res) => {
    const result = await removeProduct(req.params.id!);
    return res.status(200).json({ message: "Deleted Successfully", result });
};
