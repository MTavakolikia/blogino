import { prisma } from "@/utils/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CategoryList from "./CategoryList";
import CreateCategoryDialog from "./CreateCategoryDialog";

async function getCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <ProtectedRoute requiredRoles={["ADMIN", "AUTHOR"]}>
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold mb-6 text-center">Manage Categories</h1>
                    <CreateCategoryDialog>
                        <Button>Add Category</Button>
                    </CreateCategoryDialog>
                </div>

                <CategoryList categories={categories} />
            </div>
        </ProtectedRoute>
    );
}