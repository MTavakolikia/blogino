import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const authenticateUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as {
            userId: string;
            role: string;
        };
        return decoded;
    } catch (error) {
        return null;
    }
};
