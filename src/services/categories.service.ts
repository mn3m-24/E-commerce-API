import Category from "../models/category.model.ts";
import type { ICategory } from "../types/categories.types.ts";
import APIFeatures from "./features.service.ts";
import Product from "../models/product.model.ts";
import { Types } from "mongoose";

export default class categoriesService {
    static async getAll(queryStr: Record<string, any>) {
        return new APIFeatures<ICategory>(Category.find(), queryStr)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .search()
            .query.lean();
    }

    static async getOne(id: string) {
        return Category.findById(new Types.ObjectId(id)).lean();
    }

    static async create(body: { name: string; description: string }) {
        return (await Category.create(body)).toObject();
    }

    static async update(
        id: string,
        body: { name?: string; description?: string },
    ) {
        return Category.findByIdAndUpdate(
            new Types.ObjectId(id),
            {
                $set: body,
            },
            { new: true },
        ).lean();
    }

    static async delete(id: string) {
        return Category.findByIdAndDelete(new Types.ObjectId(id)).lean();
    }

    static async getProductsByCategory(id: string) {
        return Product.find({ category: new Types.ObjectId(id) }).lean();
    }
}
