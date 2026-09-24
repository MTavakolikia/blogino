import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

async function findOwnedComment(commentId: string, user: { id: string; role: string }) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return { comment: null, ok: false };
    const ok = user.role === "ADMIN" || comment.userId === user.id;
    return { comment, ok };
}

export async function PATCH(req: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(req);
        if (authError) return authError;

        const { id, content } = await req.json();

        if (!id || !content) {
            return NextResponse.json({ error: "Comment ID and text are required." }, { status: 400 });
        }

        const { comment, ok } = await findOwnedComment(id, req.user!);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        }
        if (!ok) {
            return NextResponse.json(
                { error: "You can only edit your own comments." },
                { status: 403 },
            );
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

export async function DELETE(req: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(req);
        if (authError) return authError;

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Comment ID is required." }, { status: 400 });
        }

        const { comment, ok } = await findOwnedComment(id, req.user!);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found." }, { status: 404 });
        }
        if (!ok) {
            return NextResponse.json(
                { error: "You can only delete your own comments." },
                { status: 403 },
            );
        }

        // Delete replies first, then the comment itself.
        await prisma.comment.deleteMany({ where: { parentId: id } });
        await prisma.comment.delete({ where: { id } });

        return NextResponse.json({ message: "Comment deleted." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ error: "Error deleting comment" }, { status: 500 });
    }
}
