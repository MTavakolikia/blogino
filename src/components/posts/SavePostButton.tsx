"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface SavePostButtonProps {
    postId: string;
    isSaved?: boolean;
    onSaveChange?: (saved: boolean) => void;
}

export default function SavePostButton({ postId, isSaved = false, onSaveChange }: SavePostButtonProps) {
    const [saving, setSaving] = useState(false);

    const handleSaveToggle = async () => {
        setSaving(true);
        try {
            if (isSaved) {
                await axios.delete("/api/posts/saved", {
                    data: { postId }
                });
                toast.success("Post removed from saved posts");
            } else {
                await axios.post("/api/posts/saved", { postId });
                toast.success("Post saved successfully");
            }
            onSaveChange?.(!isSaved);
        } catch (error) {
            console.error("Error toggling save:", error);
            toast.error(isSaved ? "Failed to remove from saved posts" : "Failed to save post");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleSaveToggle}
            disabled={saving}
            className={`text-muted-foreground hover:text-primary ${isSaved ? "text-primary" : ""}`}
        >
            {isSaved ? (
                <BookmarkCheck className="h-5 w-5" />
            ) : (
                <Bookmark className="h-5 w-5" />
            )}
        </Button>
    );
}