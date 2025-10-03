import { Types } from "mongoose";
import Product from "../models/product.model.ts";

export default class ProductService {
    static async fetchProducts() {
        return Product.find().lean();
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
