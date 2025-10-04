import { Types } from "mongoose";
import Product from "../models/product.model.ts";
import APIFeatures from "./features.service.ts";
import type { IProduct } from "../types/products.types.ts";

export default class ProductService {
    static async fetchProducts(queryStr: Record<string, any>) {
        return new APIFeatures<IProduct>(Product.find(), queryStr)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .search()
            .query.lean();
    }

    static async fetchProduct(id: string) {
        return Product.findById(new Types.ObjectId(id)).lean();
    }

    static async createProduct(name: string, price: number, category: string) {
        return Product.create({
            name,
            price,
            category: new Types.ObjectId(category),
        });
    }

    static async updateProduct(id: string, doc: object) {
        return Product.findByIdAndUpdate(
            new Types.ObjectId(id),
            { $set: doc },
            { new: true },
        ).lean();
    }

    static async removeProduct(id: string) {
        return Product.findByIdAndDelete(new Types.ObjectId(id)).lean();
    }
}
