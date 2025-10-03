import { Types, Document } from "mongoose";

export interface IRfreshToken extends Document {
    _id: Types.ObjectId;
    tokenHash: string;
    userId: Types.ObjectId;
    jti: string;
    revoked: boolean;
    replacedBy?: Types.ObjectId;
    familyId: string;
    expiresAt: Date;
}
