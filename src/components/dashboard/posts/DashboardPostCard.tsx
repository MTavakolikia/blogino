'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye, EyeOff, CheckCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

    const handleUnpublish = async () => {
        await axios.put(`/api/posts/${post?.id}`, { published: false, id: post.id });
        router.refresh();
    };

    const handlePublish = async () => {
        await axios.put(`/api/posts/${post?.id}`, { published: true });
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
                    <Button variant="outline" size="icon">
                        <Link href={`/dashboard/posts/${post.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                        <Link href={`/dashboard/posts/${post.id}`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    {post.published ? (
                        <Button variant="outline" size="icon" onClick={handleUnpublish}>
                            <EyeOff className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button variant="outline" size="icon" onClick={handlePublish}>
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
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