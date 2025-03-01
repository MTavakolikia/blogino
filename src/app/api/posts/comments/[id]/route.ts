import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { id, content } = await req.json();

        if (!id || !content) {
            return NextResponse.json({ error: "شناسه و متن کامنت الزامی است." }, { status: 400 });
        }

        const updatedComment = await prisma.comment.update({
            where: { id },
            data: { content },
        });

        return NextResponse.json(updatedComment, { status: 200 });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ error: "خطا در بروزرسانی کامنت" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "شناسه کامنت الزامی است." }, { status: 400 });
        }

        // اول باید همه‌ی پاسخ‌های کامنت را حذف کنیم
        await prisma.comment.deleteMany({
            where: { parentId: id },
        });

        // سپس خود کامنت را حذف کنیم
        await prisma.comment.delete({
            where: { id },
        });

        return NextResponse.json({ message: "کامنت حذف شد." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ error: "خطا در حذف کامنت" }, { status: 500 });
    }
}
