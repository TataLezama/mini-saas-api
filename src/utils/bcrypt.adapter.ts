import { compareSync, hash, hashSync } from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await hash(password, SALT_ROUNDS);
    return hashSync(password, salt);
}

export const comparePassword = (
    password: string,
    hashedPassword: string): boolean => {
    return compareSync(password, hashedPassword);
}