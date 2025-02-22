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

// Get all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}