import User from "../models/user.model.ts";
import { hashInput } from "../utils/hash.utils.ts";
import { Types } from "mongoose";

export default class UserService {
    static async createUser(email: string, password: string) {
        return User.create({ email, passwordHash: hashInput(password) });
    }

    static async fetchUserByEmail(email: string) {
        return User.findOne({ email }).lean();
    }

    static async fetchUserById(id: string) {
        return User.findById(new Types.ObjectId(id)).lean();
    }

    static async fetchUsers() {
        return User.find().lean();
    }

    static async removeUserById(id: string) {
        return User.findByIdAndDelete(new Types.ObjectId(id)).lean();
    }

    static async updateUserById(id: string, newFields: Record<string, any>) {
        const updateData: Record<string, string> = { ...newFields };
        if (newFields.password) {
            updateData.passwordHash = hashInput(newFields.password);
            delete updateData.password;
        }
        return User.findByIdAndUpdate(
            new Types.ObjectId(id),
            {
                $set: updateData,
            },
            { new: true },
        ).lean();
    }
}
