import bcrypt from "bcrypt";

/**
 * Hash password
 * @param password - Password to be hashed
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Verify password
 * @param password - User input password
 * @param hashedPassword - Password stored in database
 * @returns Boolean value (true if password is correct, false if incorrect)
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};
