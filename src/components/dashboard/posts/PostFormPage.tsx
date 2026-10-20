"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    CheckCircle2,
    ExternalLink,
    ImagePlus,
    Loader2,
    PenLine,
    Save,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/posts/RichTextEditor";
import Link from "next/link";

const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(120, "Keep the title under 120 characters"),
    content: z.string().min(10, "Write a little more before saving"),
    categoryId: z.string().min(1, "Pick a category"),
    image: z.string().url("That doesn't look like a valid image URL").optional().or(z.literal("")),
});

type PostFormValues = z.infer<typeof postSchema>;

export interface EditablePost {
    id: string;
    title: string;
    content: string;
    published: boolean;
    categoryId: string | null;
    images: string[];
}

interface Category {
    id: string;
    name: string;
}

export default function PostForm({ mode, post }: { mode: "create" | "edit"; post?: EditablePost }) {
    const router = useRouter();
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [fetchingCategories, setFetchingCategories] = React.useState(true);
    const [saving, setSaving] = React.useState<"draft" | "publish" | null>(null);

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues:
            mode === "edit" && post
                ? {
                      title: post.title,
                      content: post.content,
                      categoryId: post.categoryId ?? "",
                      image: post.images[0] ?? "",
                  }
                : { title: "", content: "", categoryId: "", image: "" },
    });

    React.useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("/api/categories");
                setCategories(res.data);
            } catch {
                /* ignore */
            } finally {
                setFetchingCategories(false);
            }
        })();
    }, []);

    const save = async (published: boolean) => {
        setSaving(published ? "publish" : "draft");
        try {
            const values = form.getValues();
            const images = values.image?.trim() ? [values.image.trim()] : [];

            if (mode === "create") {
                await axios.post("/api/posts", {
                    title: values.title,
                    content: values.content,
                    categoryId: values.categoryId || null,
                    images,
                });
                toast.success("Draft created — you can publish it from the posts list.");
                router.push("/dashboard/posts");
                router.refresh();
            } else if (post) {
                await axios.put(`/api/posts/${post.id}`, {
                    title: values.title,
                    content: values.content,
                    categoryId: values.categoryId || null,
                    images,
                    published,
                });
                toast.success(
                    published ? "Post saved and published" : "Draft saved",
                );
                router.push("/dashboard/posts");
                router.refresh();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to save post");
            } else {
                toast.error("Failed to save post");
            }
        } finally {
            setSaving(null);
        }
    };

    const onSubmit = form.handleSubmit(() => {
        if (mode === "edit") {
            // Keep the current publish state when saving from edit mode via the form button.
            save(post?.published ?? false);
        } else {
            save(false);
        }
    });

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <Link
                    href="/dashboard/posts"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to posts
                </Link>
                <h1 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight">
                    <PenLine className="h-5 w-5 text-primary" />
                    {mode === "create" ? "Write a new post" : "Edit post"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {mode === "create"
                        ? "New posts are saved as drafts — publish them when they're ready."
                        : post?.published
                            ? "This post is currently live on the blog."
                            : "This post is a draft and not visible yet."}
                </p>
            </div>

            <form
                onSubmit={onSubmit}
                className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
            >
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        placeholder="A title people will actually click"
                        {...form.register("title")}
                    />
                    {form.formState.errors.title && (
                        <p className="text-xs text-destructive">
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={form.watch("categoryId") || undefined}
                            onValueChange={(v) =>
                                form.setValue("categoryId", v, { shouldValidate: true })
                            }
                            disabled={fetchingCategories}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={fetchingCategories ? "Loading…" : "Select a category"} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.categoryId && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.categoryId.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image">
                            Cover image{" "}
                            <span className="font-normal text-muted-foreground">(URL)</span>
                        </Label>
                        <div className="relative">
                            <ImagePlus className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="image"
                                placeholder="https://…"
                                className="pl-8"
                                {...form.register("image")}
                            />
                        </div>
                        {form.formState.errors.image && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.image.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Content</Label>
                    <RichTextEditor
                        key={post?.id ?? "new"}
                        value={form.watch("content")}
                        onChange={(v) => form.setValue("content", v, { shouldValidate: true })}
                    />
                    {form.formState.errors.content && (
                        <p className="text-xs text-destructive">
                            {form.formState.errors.content.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-5">
                    {mode === "edit" && (
                        <Button
                            type="button"
                            variant="outline"
                            disabled={saving !== null}
                            onClick={() => save(false)}
                        >
                            {saving === "draft" ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save draft
                        </Button>
                    )}
                    <Button type="submit" disabled={saving !== null}>
                        {saving === "publish" ? (
                            <Loader2 className="animate-spin" />
                        ) : mode === "create" ? (
                            <Save className="h-4 w-4" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}
                        {mode === "create" ? "Save as draft" : "Save & publish"}
                    </Button>
                    {mode === "edit" && post && (
                        <Button type="button" variant="ghost" asChild>
                            <Link href={`/post/${post.id}`}>
                                <ExternalLink className="h-4 w-4" /> Preview
                            </Link>
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
