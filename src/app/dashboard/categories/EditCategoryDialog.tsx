"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(50, "Category name cannot exceed 50 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
    id: string;
    name: string;
    _count: {
        posts: number;
    };
}

interface EditCategoryDialogProps {
    category: Category;
    onClose: () => void;
    onUpdate: (category: Category) => void;
}

export default function EditCategoryDialog({
    category,
    onClose,
    onUpdate,
}: EditCategoryDialogProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category.name,
        },
    });

    useEffect(() => {
        form.reset({
            name: category.name,
        });
    }, [category, form]);

    const onSubmit = async (data: CategoryFormData) => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/categories/${category.id}`, data);
            onUpdate(response.data);
            toast.success("Category updated successfully");
            onClose();
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error("Failed to update category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Updating..." : "Update Category"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 