"use client";

import * as React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Loader2,
    Pencil,
    Plus,
    Search,
    Tag,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export interface CategoryRow {
    id: string;
    name: string;
    posts: number;
    createdAt: string;
}

const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(50, "Keep it under 50 characters"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryManager({
    initialCategories,
}: {
    initialCategories: CategoryRow[];
}) {
    const [categories, setCategories] = React.useState<CategoryRow[]>(
        initialCategories,
    );
    const [query, setQuery] = React.useState("");
    const [createOpen, setCreateOpen] = React.useState(false);
    const [editing, setEditing] = React.useState<CategoryRow | null>(null);
    const [deleting, setDeleting] = React.useState<CategoryRow | null>(null);

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase()),
    );

    const refresh = (next: CategoryRow[]) => setCategories(next);

    const handleDelete = async (category: CategoryRow) => {
        setDeleting(null);
        try {
            const res = await axios.delete(`/api/categories/${category.id}`);
            refresh(categories.filter((c) => c.id !== category.id));
            toast.success(res.data.message || "Category deleted");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to delete category");
            } else {
                toast.error("Failed to delete category");
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Filter categories..."
                        className="pl-8"
                    />
                </div>
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                    <Plus className="h-4 w-4" /> New category
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Posts</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-24 text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    {query
                                        ? "No categories match your filter."
                                        : "No categories yet — create the first one."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        <span className="flex items-center gap-2">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                <Tag className="h-3.5 w-3.5" />
                                            </span>
                                            {category.name}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs tabular-nums">
                                            {category.posts}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(category.createdAt).toLocaleDateString(
                                            "en-US",
                                            { month: "short", day: "numeric", year: "numeric" },
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setEditing(category)}
                                                aria-label={`Edit ${category.name}`}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => setDeleting(category)}
                                                aria-label={`Delete ${category.name}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreateCategoryDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={(name) =>
                    refresh(
                        [
                            {
                                id: `pending-${Date.now()}`,
                                name,
                                posts: 0,
                                createdAt: new Date().toISOString(),
                            },
                            ...categories,
                        ].sort((a, b) => a.name.localeCompare(b.name)),
                    )
                }
            />

            {editing && (
                <EditCategoryDialog
                    category={editing}
                    onClose={() => setEditing(null)}
                    onUpdated={(updated) =>
                        refresh(
                            categories
                                .map((c) => (c.id === updated.id ? updated : c))
                                .sort((a, b) => a.name.localeCompare(b.name)),
                        )
                    }
                />
            )}

            <AlertDialog
                open={!!deleting}
                onOpenChange={(open) => !open && setDeleting(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{deleting?.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This can&apos;t be undone.{" "}
                            {deleting && deleting.posts > 0
                                ? `It still has ${deleting.posts} post(s), so it can't be deleted — move those posts first.`
                                : "Posts in this category will be unaffected."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={!!deleting && deleting.posts > 0}
                            onClick={() => deleting && handleDelete(deleting)}
                        >
                            Delete category
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function CreateCategoryDialog({
    open,
    onOpenChange,
    onCreated,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (name: string) => void;
}) {
    const [loading, setLoading] = React.useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "" },
    });

    const onSubmit = async (data: CategoryFormValues) => {
        setLoading(true);
        try {
            await axios.post("/api/categories", { name: data.name });
            toast.success(`Category "${data.name}" created`);
            form.reset();
            onOpenChange(false);
            onCreated(data.name);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to create category");
            } else {
                toast.error("Failed to create category");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New category</DialogTitle>
                    <DialogDescription>
                        Group your articles by topic.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Web Development"
                                            autoFocus
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="animate-spin" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function EditCategoryDialog({
    category,
    onClose,
    onUpdated,
}: {
    category: CategoryRow;
    onClose: () => void;
    onUpdated: (category: CategoryRow) => void;
}) {
    const [loading, setLoading] = React.useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: category.name },
    });

    const onSubmit = async (data: CategoryFormValues) => {
        setLoading(true);
        try {
            await axios.patch(`/api/categories/${category.id}`, { name: data.name });
            toast.success(`Category renamed to "${data.name}"`);
            onUpdated({ ...category, name: data.name });
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to rename category");
            } else {
                toast.error("Failed to rename category");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rename category</DialogTitle>
                    <DialogDescription>
                        Posts keep their link — only the display name changes.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input autoFocus {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
