import { Types, Document } from "mongoose";
import type { IProduct } from "./products.types.ts";
import type { IUser } from "./users.types.ts";

export interface ICartItem {
    productId: Types.ObjectId | IProduct;
    quantity: number;
}

export type ICart = {
    _id?: Types.ObjectId;
    userId: Types.ObjectId | IUser;
    items: ICartItem[];
    createAt?: Date;
    updatedAt?: Date;
} & Document;
