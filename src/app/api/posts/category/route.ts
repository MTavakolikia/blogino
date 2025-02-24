import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: { name },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}


export async function GET(request: Request) {
    try {
        const { id } = await request.json();

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