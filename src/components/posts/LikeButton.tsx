"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface LikeButtonProps {
    postId: string;
    initialLikeCount?: number;
    initialIsLiked?: boolean;
}

export default function LikeButton({ postId, initialLikeCount = 0, initialIsLiked = false }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchLikeStatus();
    }, [postId]);

    const fetchLikeStatus = async () => {
        try {
            const response = await axios.get(`/api/posts/${postId}/like`);
            setIsLiked(response.data.isLiked);
            setLikeCount(response.data.likeCount || 0);
        } catch (error) {
            console.error("Error fetching like status:", error);
            setLikeCount(0);
        }
    };

    const handleLike = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`/api/posts/${postId}/like`);
            setIsLiked(response.data.liked);
            setLikeCount(response.data.likeCount || 0);
            toast.success(response.data.liked ? "Post liked!" : "Post unliked!");
        } catch (error) {
            console.error("Error handling like:", error);
            toast.error("Failed to update like status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}
        >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount || 0}</span>
        </Button>
    );
}