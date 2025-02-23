"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required!"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

type Category = {
    id: string;
    name: string;
};

export default function ManageCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/posts/category");
            setCategories(res.data);
        } catch (error) {
            toast("Failed to fetch categories.");
        }
    };

    const onSubmit = async (data: CategoryFormData) => {
        setLoading(true);
        try {
            if (editCategory) {
                await axios.put(`/api/posts/category/${editCategory.id}`, { name: data.name, id: editCategory.id });
                toast("Category updated successfully!");
            } else {
                await axios.post("/api/posts/category", data);
                toast("Category added successfully!");
            }
            reset();
            setEditCategory(null);
            fetchCategories();
        } catch (error) {
            toast("Error while saving category.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/posts/category/${id}`);
            toast("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            toast("Error deleting category.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Manage Categories</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex gap-4">
                <Input {...register("name")} placeholder="Category Name" />
                <Button type="submit" disabled={loading}>{editCategory ? "Update" : "Add"}</Button>
            </form>
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category) => (
                    <Card key={category.id}>
                        <CardHeader>
                            <CardTitle>Category Name: <span className="text-cyan-500">{category.name}</span></CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between">
                            <Button size="sm" variant="outline" onClick={() => { setEditCategory(category); setValue("name", category.name) }}>Edit</Button>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button size="sm" variant="destructive" >Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-800 hover:bg-red-900" onClick={() => handleDelete(category.id)}>
                                            Delete

                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                ))}
            </div>


        </div>
    );
}