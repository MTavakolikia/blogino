import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // دریافت کوکی auth_token از درخواست
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        // اگر توکن وجود ندارد، کاربر را به صفحه ورود هدایت می‌کنیم
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // اضافه کردن اطلاعات کاربر به هدر درخواست (فقط برای نمونه)
    const response = NextResponse.next();
    response.headers.set("x-user", JSON.stringify({ tokenPresent: true }));

    return response;
}

// مسیرهای محافظت شده
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"],
};