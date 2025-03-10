import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
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
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate request
        const authError = await authenticateAPI(request, ["ADMIN", "AUTHOR"]);
        if (authError) return authError;

        const { name } = await request.json();

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id: params.id },
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
                NOT: { id: params.id },
            },
        });

        if (nameExists) {
            return NextResponse.json(
                { error: "Category name already exists" },
                { status: 400 }
            );
        }

        const category = await prisma.category.update({
            where: { id: params.id },
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
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate request
        const authError = await authenticateAPI(request, ["ADMIN"]);
        if (authError) return authError;

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id: params.id },
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

        // Check if category has posts
        if (category._count.posts > 0) {
            return NextResponse.json(
                { error: "Cannot delete category with existing posts" },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: params.id },
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