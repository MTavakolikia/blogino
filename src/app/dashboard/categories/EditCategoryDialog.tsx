"use client";

import { useState, useEffect } from "react";
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
    name: z.string().min(1, "نام دسته‌بندی الزامی است").max(50, "نام دسته‌بندی نمی‌تواند بیشتر از 50 کاراکتر باشد"),
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

            const response = await axios.patch(`/api/posts/category/${category.id}}`, data);
            onUpdate(response.data);
            toast.success("دسته‌بندی با موفقیت ویرایش شد");
            onClose();
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error("خطا در ویرایش دسته‌بندی");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نام دسته‌بندی</FormLabel>
                                    <FormControl>
                                        <Input placeholder="نام دسته‌بندی را وارد کنید" {...field} />
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
                                انصراف
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "در حال ویرایش..." : "ویرایش دسته‌بندی"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}