import User from "../models/user.model.ts";
import { hashInput } from "../utils/hash.utils.ts";
import { Types } from "mongoose";

export const createUser = async (email: string, password: string) =>
    User.create({ email, passwordHash: hashInput(password) });

export const fetchUserByEmail = async (email: string) =>
    User.findOne({ email }).lean();

export const fetchUserById = async (id: string) =>
    User.findById(new Types.ObjectId(id)).lean();

export const fetchUsers = async () => User.find().lean();

export const removeUserById = async (id: string) =>
    User.findByIdAndDelete(new Types.ObjectId(id)).lean();

export const updateUserById = async (id: string, newFields: object) =>
    User.findByIdAndUpdate(new Types.ObjectId(id), { $set: newFields }).lean();
