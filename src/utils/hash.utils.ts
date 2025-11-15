import { hashSync, compareSync } from "bcryptjs";

export const hashInput = (input: string) => hashSync(input, 11);

export const compareHash = (input: string, hash: string) =>
    compareSync(input, hash);
