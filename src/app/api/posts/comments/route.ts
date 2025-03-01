import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json({ error: "شناسه پست الزامی است." }, { status: 400 });
        }

        const comments = await prisma.comment.findMany({
            where: { postId, parentId: null }, // فقط کامنت‌های والد را می‌گیرد
            include: {
                user: { select: { firstName: true, lastName: true, profilePic: true } },
                replies: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profilePic: true } },
                    },
                },
            },
        });

        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "خطا در دریافت کامنت‌ها" }, { status: 500 });
    }
}



export async function POST(req: Request) {
    try {
        const { content, postId, userId, parentId } = await req.json();

        if (!content || !postId || !userId) {
            return NextResponse.json({ error: "اطلاعات ناقص است." }, { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId,
                parentId, // اگر parentId داشته باشد یعنی یک "پاسخ" است
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "مشکلی رخ داده است." }, { status: 500 });
    }
}
