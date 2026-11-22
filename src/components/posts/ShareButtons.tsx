"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Link2 } from "lucide-react";
import { FaTwitter, FaLinkedin } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShareButtons({
    url,
    title,
    className,
}: {
    url: string;
    title: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);
    const absolute =
        typeof window === "undefined" ? url : window.location.origin + url;

    const shareTo = (network: "x" | "linkedin") => {
        const base =
            network === "x"
                ? "https://twitter.com/intent/tweet"
                : "https://www.linkedin.com/sharing/share-offsite/";
        const href = `${base}?${
            network === "x" ? "text" : "url"
        }=${encodeURIComponent(
            network === "x" ? `${title} — via Blogino` : absolute,
        )}${network === "x" ? `&url=${encodeURIComponent(absolute)}` : ""}`;
        window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
    };

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(absolute);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Could not copy link");
        }
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Share
            </span>
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => shareTo("x")}
                aria-label="Share on X"
            >
                <FaTwitter size={15} />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => shareTo("linkedin")}
                aria-label="Share on LinkedIn"
            >
                <FaLinkedin size={15} />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={copy}
                aria-label="Copy link"
            >
                {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                ) : (
                    <Link2 className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}
