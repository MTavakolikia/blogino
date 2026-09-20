import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logout Successfully!" });
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    response.headers.set(
        "Set-Cookie",
        `auth_token=; HttpOnly; SameSite=Strict; Path=/${secure}; Max-Age=0`,
    );
    return response;
}
