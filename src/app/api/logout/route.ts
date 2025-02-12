import { NextResponse } from "next/server";
import { deleteCookie } from "cookies-next";

export async function POST(request: Request) {
    try {
        const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });

        deleteCookie("auth_token",
            {
                req: { headers: request.headers },
                res: response,
            },
        );

        return response;
    } catch (error) {
        console.error("Error during logout:", error);
        return NextResponse.json(
            {
                error: "Failed to logout",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}