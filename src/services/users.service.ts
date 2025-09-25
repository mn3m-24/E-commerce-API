import userModel from "../models/user.model.ts";
import { hashInput } from "../utils/hash.utils.ts";
import { Types } from "mongoose";

export const createUser = async (email: string, password: string) =>
    userModel.create({ email, passwordHash: hashInput(password) });

export const findUserByEmail = async (email: string) =>
    userModel.findOne({ email });

export const findUserById = async (id: Types.ObjectId) =>
    userModel.findById(id);
