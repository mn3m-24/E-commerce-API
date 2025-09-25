import bcrypt from "bcryptjs";

export const hashInput = (input: string) => bcrypt.hashSync(input, 11);

export const compareHash = (input: string, hash: string) =>
    bcrypt.compareSync(input, hash);
