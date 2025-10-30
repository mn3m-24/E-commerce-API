import categoriesService from "../services/categories.service.ts";
import type { Request, Response } from "express";

export async function getAllCategories(req: Request, res: Response) {
    const categories = await categoriesService.getAll(req.query);
    return res.status(200).json({ categories });
}

export async function createCategory(req: Request, res: Response) {
    const category = await categoriesService.create(req.body);
    return res.status(201).json({ category });
}

export async function getCategory(req: Request, res: Response) {
    const category = await categoriesService.getOne(req.params.id!);
    return res.status(200).json({ category });
}

export async function updateCategory(req: Request, res: Response) {
    const category = await categoriesService.update(req.params.id!, req.body);
    return res.status(200).json({ category });
}

export async function deleteCategory(req: Request, res: Response) {
    const category = await categoriesService.delete(req.params.id!);
    return res.status(200).json({ category });
}

export async function getCategoryProducts(req: Request, res: Response) {
    const products = await categoriesService.getProductsByCategory(
        req.params.id!,
    );
    return res.status(200).json({ products });
}
