import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const cookie = serialize("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // حذف کوکی
    });

    const response = NextResponse.json({ message: "خروج موفقیت‌آمیز!" });
    response.headers.set("Set-Cookie", cookie);
    return response;
}
