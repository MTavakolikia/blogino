'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, EyeOff, CheckCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardPostCardProps {
    post: {
        id: string;
        title: string;
        published: boolean;
        createdAt: Date;
        author: {
            firstName: string;
            lastName: string;
        };
    };
}

export default function DashboardPostCard({ post }: DashboardPostCardProps) {
    const router = useRouter();

    const handleTogglePublishPost = async (isPublished: boolean) => {
        if (isPublished) {
            await axios.put(`/api/posts/${post?.id}`, { published: false });
        } else {
            await axios.put(`/api/posts/${post?.id}`, { published: true });
        }
        toast.success(`Post ${isPublished ? "unpublished" : "published"} successfully!`);
        router.refresh();
    };

    return (
        <div className="p-4 border rounded-lg bg-card">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="text-sm text-muted-foreground">
                        By {post.author.firstName} {post.author.lastName}
                    </p>
                </div>
                <div className="flex gap-2">


                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Link href={`/dashboard/posts/${post.id}/edit`}>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit post</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleTogglePublishPost(post.published)}
                            >
                                {post.published ? <EyeOff className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{post.published ? "Unpublish post" : "Publish post"}</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete post</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                    Status: {post.published ? "Published" : "Draft"}
                </p>
                <p className="text-sm text-muted-foreground">
                    Created: {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>
        </div>
    );
}