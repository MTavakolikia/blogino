import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

export async function PUT(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN", "AUTHOR"]);
        if (authError) return authError;

        const { name } = await request.json();
        const { id } = await params;

        if (!id || !name) {
            return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN"]);
        if (authError) return authError;

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { posts: true } } },
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        if (category._count.posts > 0) {
            return NextResponse.json(
                { error: "Cannot delete a category that still has posts" },
                { status: 400 },
            );
        }

        await prisma.category.delete({ where: { id } });

        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}





export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}