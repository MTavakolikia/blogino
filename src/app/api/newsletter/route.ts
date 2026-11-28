import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { revalidateTag } from "next/cache";

/**
 * Subscribe an email to the blog newsletter. Idempotent — resubscribing
 * with the same address keeps a single row.
 */
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        const value = String(email ?? "").trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 },
            );
        }

        await prisma.newsletterSubscriber.upsert({
            where: { email: value },
            update: {},
            create: { email: value },
        });

        revalidateTag("newsletter", "max");
        const subscribers = await prisma.newsletterSubscriber.count();

        return NextResponse.json({
            message: "You're on the list. One email when the next post ships — nothing else.",
            subscribers,
        });
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        return NextResponse.json(
            {
                error: "Could not subscribe",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
