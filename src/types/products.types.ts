import { Types, Document } from "mongoose";

export interface IProduct extends Document {
    _id: Types.ObjectId;
    name: string;
    price: number;
    stock: number;
    category: Types.ObjectId;
}
