import { Types } from "mongoose";
import Product from "../models/product.model.ts";

export const fetchProducts = async () => Product.find().lean();

export const fetchProduct = async (id: string) =>
    Product.findById(new Types.ObjectId(id)).lean();

export const createProduct = (name: string, price: number, category: string) =>
    Product.create({ name, price, category: new Types.ObjectId(category) });

export const updateProduct = (id: string, doc: object) =>
    Product.findByIdAndUpdate(
        new Types.ObjectId(id),
        { $set: doc },
        { new: true },
    ).lean();

export const removeProduct = async (id: string) =>
    Product.findByIdAndDelete(new Types.ObjectId(id)).lean();
