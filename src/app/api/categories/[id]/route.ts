import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ id: string }>
    }) {
    try {
        const { id } = await params
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        return NextResponse.json(
            { error: "Failed to fetch category" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: AuthenticatedRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>
    }
) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN", "AUTHOR"]);
        if (authError) return authError;

        const { name } = await request.json();

        const { id } = await params
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        // Check if new name already exists
        const nameExists = await prisma.category.findFirst({
            where: {
                name,
                NOT: { id },
            },
        });

        if (nameExists) {
            return NextResponse.json(
                { error: "Category name already exists" },
                { status: 400 }
            );
        }

        const category = await prisma.category.update({
            where: { id },
            data: { name },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: AuthenticatedRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>
    }
) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN"]);
        if (authError) return authError;

        const { id } = await params
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        if (category._count.posts > 0) {
            return NextResponse.json(
                { error: "Cannot delete category with existing posts" },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
} 