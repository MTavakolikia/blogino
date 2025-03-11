"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import EditCategoryDialog from "./EditCategoryDialog";

interface Category {
    id: string;
    name: string;
    _count: {
        posts: number;
    };
}

interface CategoryListProps {
    categories: Category[];
}

export default function CategoryList({ categories: initialCategories }: CategoryListProps) {
    const [categories, setCategories] = useState(initialCategories);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/posts/category/${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
            toast.success("Category deleted successfully");
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Failed to delete category");
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Posts</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                {category.name}
                            </TableCell>
                            <TableCell>{category._count.posts}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingCategory(category)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(category.id)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {editingCategory && (
                <EditCategoryDialog
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onUpdate={(updatedCategory) => {
                        setCategories(
                            categories.map((cat) =>
                                cat.id === updatedCategory.id ? updatedCategory : cat
                            )
                        );
                    }}
                />
            )}
        </div>
    );
} 