import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { id, content } = await req.json();

        if (!id || !content) {
            return NextResponse.json({ error: "Comment ID and text are required." }, { status: 400 });
        }

        const updatedComment = await prisma.comment.update({
            where: { id },
            data: { content },
        });

        return NextResponse.json(updatedComment, { status: 200 });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ error: "Error updating comment" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Comment ID is required." }, { status: 400 });
        }

        // First, delete all replies to the comment
        await prisma.comment.deleteMany({
            where: { parentId: id },
        });

        // Then, delete the comment itself
        await prisma.comment.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Comment deleted." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ error: "Error deleting comment" }, { status: 500 });
    }
}
