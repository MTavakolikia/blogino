"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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

interface CreateCategoryDialogProps {
    children: React.ReactNode;
}

export default function CreateCategoryDialog({ children }: CreateCategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    });

    const onSubmit = async (data: CategoryFormData) => {
        try {
            setLoading(true);
            await axios.post("/api/posts/category", data);
            toast.success("دسته‌بندی با موفقیت ایجاد شد");
            form.reset();
            setOpen(false);
            // Reload the page to refresh the categories list
            window.location.reload();
        } catch (error) {
            console.error("Failed to create category:", error);
            toast.error("خطا در ایجاد دسته‌بندی");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>ایجاد دسته‌بندی جدید</DialogTitle>
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
                                onClick={() => setOpen(false)}
                            >
                                انصراف
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "در حال ایجاد..." : "ایجاد دسته‌بندی"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}