import productModel from "../models/product.model.ts";

export async function getAllProducts() {
    return productModel.find();
}
