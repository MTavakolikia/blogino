"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function CopyEmailButton({ email }: { email: string }) {
    const [copied, setCopied] = React.useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            toast.success("Email copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Couldn't copy — please select it manually");
        }
    };

    return (
        <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
        </Button>
    );
}
