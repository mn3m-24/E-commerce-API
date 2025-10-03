import { Types, Document } from "mongoose";

export interface ICartItem {
    productId: Types.ObjectId;
    quantity: number;
}

export type ICart = {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    items: ICartItem[];
    createAt?: Date;
    updatedAt?: Date;
} & Document;
