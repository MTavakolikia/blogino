import { prisma } from "@/utils/prisma";

/**
 * Deletes everything a user owns (in FK-safe order), then the user.
 * Used by the admin "delete user" flows so the hard delete doesn't
 * fail on foreign key constraints.
 */
export async function purgeUser(userId: string) {
    await prisma.$transaction(async (tx) => {
        // Child rows of the user's posts.
        await tx.like.deleteMany({
            where: { OR: [{ userId }, { post: { authorId: userId } }] },
        });
        await tx.savedPost.deleteMany({
            where: { OR: [{ userId }, { post: { authorId: userId } }] },
        });
        await tx.comment.deleteMany({
            where: { OR: [{ userId }, { post: { authorId: userId } }] },
        });
        await tx.post.deleteMany({ where: { authorId: userId } });

        // Rows that reference the user directly.
        await tx.like.deleteMany({ where: { userId } });
        await tx.savedPost.deleteMany({ where: { userId } });
        await tx.comment.deleteMany({ where: { userId } });
        await tx.auditLog.deleteMany({
            where: { OR: [{ userId }, { actionById: userId }] },
        });

        await tx.user.delete({ where: { id: userId } });
    });
}
