import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";

export const authenticateUser = (request: Request) => {
    const token = getCookie("auth_token", {
        req: { headers: request.headers },
        res: null,
    });

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token.toString(), process.env.JWT_SECRET!) as {
            userId: string;
            role: string;
        };
        return decoded;
    } catch (error) {
        return null;
    }
};