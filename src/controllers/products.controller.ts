import type { RequestHandler } from "express";
import ProductService from "../services/products.service.ts";

export const getProducts: RequestHandler = async (req, res) => {
    const products = await ProductService.fetchProducts(req.query);
    return res.status(200).json(products);
};

export const getOneProduct: RequestHandler = async (req, res) => {
    const product = await ProductService.fetchProduct(req.params.id!);
    return res.status(200).json(product);
};

export const postOneProduct: RequestHandler = async (req, res) => {
    const { name, price, category } = req.body;
    const product = await ProductService.createProduct(name, price, category);
    return res
        .status(201)
        .json({ message: "Product created successfully", product });
};

export const patchOneProduct: RequestHandler = async (req, res) => {
    const product = await ProductService.updateProduct(
        req.params.id!,
        req.body,
    );
    return res.status(200).json(product);
};

export const deleteOneProduct: RequestHandler = async (req, res) => {
    const result = await ProductService.removeProduct(req.params.id!);
    return res.status(200).json({ message: "Deleted Successfully", result });
};
