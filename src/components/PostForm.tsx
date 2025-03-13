"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import useUserStore from "@/store/userStore";
import { toast } from "sonner";
import RichTextEditor from "./posts/RichTextEditor";


const createPostSchema = z.object({
  title: z.string().min(1, "Title is required!").max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(1, "Content is required!").max(10000, "Content cannot exceed 10000 characters"),
  categoryId: z.string().min(1, "Please select a category!"),
  image: z.string().url("Please provide a valid image URL").optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

type Category = {
  id: string;
  name: string;
};

export default function CreatePostForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/posts/category");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCategories();
  }, []);

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit = async (data: CreatePostFormData) => {
    setLoading(true);
    try {
      await axios.post("/api/posts", { ...data, authorId: user?.id });
      toast.success("Post created successfully!");
      form.reset();
    } catch (err) {
      console.error("Failed to create post:", err);
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create a New Post</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor value={field.value} onChange={field.onChange} />

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Category Selection */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {isFetching ? (
                        <>
                          <Skeleton className="h-8 w-full my-1" />
                          <Skeleton className="h-8 w-full my-1" />
                          <Skeleton className="h-8 w-full my-1" />
                        </>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category?.id} value={category?.id}>
                            {category?.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
