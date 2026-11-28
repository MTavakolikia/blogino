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
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RichTextEditor from "@/components/posts/RichTextEditor";
import { postPath } from "@/lib/seo";
import Link from "next/link";

const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(120, "Keep the title under 120 characters"),
    content: z.string().min(10, "Write a little more before saving"),
    categoryId: z.string().min(1, "Pick a category"),
    image: z.string().url("That doesn't look like a valid image URL").optional().or(z.literal("")),
    slug: z.string().max(100, "Keep the slug under 100 characters").optional(),
    excerpt: z.string().max(220, "Keep the excerpt under 220 characters").optional(),
    metaTitle: z.string().max(120, "Keep the meta title under 120 characters").optional(),
    metaDescription: z.string().max(200, "Keep the meta description under 200 characters").optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export interface EditablePost {
    id: string;
    title: string;
    content: string;
    published: boolean;
    categoryId: string | null;
    images: string[];
    slug?: string | null;
    excerpt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
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
                      slug: post.slug ?? "",
                      excerpt: post.excerpt ?? "",
                      metaTitle: post.metaTitle ?? "",
                      metaDescription: post.metaDescription ?? "",
                  }
                : {
                      title: "",
                      content: "",
                      categoryId: "",
                      image: "",
                      slug: "",
                      excerpt: "",
                      metaTitle: "",
                      metaDescription: "",
                  },
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

    const [seoOpen, setSeoOpen] = React.useState(false);
    const [generatingSeo, setGeneratingSeo] = React.useState(false);

    /** Ask the SEO tool for suggested slug/description fields and fill them. */
    const autoFillSeo = async () => {
        const values = form.getValues();
        if (!values.title || !values.content) {
            toast.error("Write a title and some content first — SEO needs something to work with.");
            return;
        }
        setGeneratingSeo(true);
        try {
            const { data } = await axios.post("/api/seo/preview", {
                title: values.title,
                content: values.content,
                excerpt: values.excerpt,
                slug: values.slug,
                metaTitle: values.metaTitle,
                metaDescription: values.metaDescription,
                postId: mode === "edit" ? post?.id : undefined,
            });
            form.setValue("slug", data.slug, { shouldValidate: true });
            form.setValue("excerpt", data.excerpt, { shouldValidate: true });
            form.setValue("metaTitle", data.metaTitle, { shouldValidate: true });
            form.setValue("metaDescription", data.metaDescription, {
                shouldValidate: true,
            });
            toast.success("SEO fields generated — review them before saving.");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error ?? "SEO generation failed");
            } else {
                toast.error("SEO generation failed");
            }
        } finally {
            setGeneratingSeo(false);
        }
    };

    const save = async (published: boolean) => {
        setSaving(published ? "publish" : "draft");
        try {
            const values = form.getValues();
            const images = values.image?.trim() ? [values.image.trim()] : [];
            const seoPayload = {
                slug: values.slug?.trim() || undefined,
                excerpt: values.excerpt?.trim() || undefined,
                metaTitle: values.metaTitle?.trim() || undefined,
                metaDescription: values.metaDescription?.trim() || undefined,
            };

            if (mode === "create") {
                await axios.post("/api/posts", {
                    title: values.title,
                    content: values.content,
                    categoryId: values.categoryId || null,
                    images,
                    ...seoPayload,
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
                    ...seoPayload,
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

                {/* SEO & sharing */}
                <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
                    <div className="rounded-xl border border-border/70 bg-muted/20">
                        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <div>
                                    <p className="text-sm font-medium">SEO &amp; sharing</p>
                                    <p className="text-xs text-muted-foreground">
                                        Slug, excerpt and meta tags — auto-generate or fine-tune
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {seoOpen ? "Hide" : "Show"}
                            </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="space-y-4 border-t border-border/60 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs text-muted-foreground">
                                        Leave anything blank and it's generated from your
                                        title &amp; content automatically on save.
                                    </p>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => void autoFillSeo()}
                                        disabled={generatingSeo}
                                    >
                                        {generatingSeo ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-4 w-4" />
                                        )}
                                        Auto-generate
                                    </Button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="seo-slug">
                                            URL slug{" "}
                                            <span className="font-normal text-muted-foreground">
                                                /post/…
                                            </span>
                                        </Label>
                                        <Input
                                            id="seo-slug"
                                            placeholder="generated-from-title"
                                            className="font-mono text-sm"
                                            {...form.register("slug")}
                                        />
                                        <p className="truncate text-xs text-muted-foreground">
                                            {form.watch("slug")
                                                ? `/post/${form.watch("slug")}`
                                                : "/post/&lt;auto-generated&gt;"}
                                        </p>
                                        {form.formState.errors.slug && (
                                            <p className="text-xs text-destructive">
                                                {form.formState.errors.slug.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="seo-metatitle">Meta title</Label>
                                        <Input
                                            id="seo-metatitle"
                                            placeholder="Defaults to the post title"
                                            {...form.register("metaTitle")}
                                        />
                                        <p className="text-xs tabular-nums text-muted-foreground">
                                            {(form.watch("metaTitle") ?? "").length}/60 recommended
                                        </p>
                                        {form.formState.errors.metaTitle && (
                                            <p className="text-xs text-destructive">
                                                {form.formState.errors.metaTitle.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="seo-excerpt">Excerpt</Label>
                                    <Textarea
                                        id="seo-excerpt"
                                        rows={2}
                                        placeholder="Shown on cards, search results and in feeds"
                                        {...form.register("excerpt")}
                                    />
                                    {form.formState.errors.excerpt && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.excerpt.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="seo-metadesc">Meta description</Label>
                                    <Textarea
                                        id="seo-metadesc"
                                        rows={3}
                                        placeholder="The search result blurb — under 160 characters"
                                        {...form.register("metaDescription")}
                                    />
                                    <p className="text-xs tabular-nums text-muted-foreground">
                                        {(form.watch("metaDescription") ?? "")
                                            .length}/160 recommended
                                    </p>
                                    {form.formState.errors.metaDescription && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.metaDescription.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </div>
                </Collapsible>

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
                            <Link href={postPath(post)}>
                                <ExternalLink className="h-4 w-4" /> Preview
                            </Link>
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
