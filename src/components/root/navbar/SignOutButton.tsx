"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import useUserStore from "@/store/userStore";

export function SignOutButton({ className }: { className?: string }) {
    const clearUser = useUserStore((s) => s.clearUser);
    const router = useRouter();
    const [signingOut, setSigningOut] = React.useState(false);

    const signOut = async () => {
        if (signingOut) return;
        setSigningOut(true);
        try {
            await axios.post("/api/auth/logout");
        } catch {
            // Even if the request fails, clear the local session below.
        }
        clearUser();
        router.push("/");
        router.refresh();
    };

    return (
        <span
            role="button"
            tabIndex={0}
            onClick={signOut}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") signOut();
            }}
            className={className}
        >
            <LogOut size={18} />
            {signingOut ? "Signing out…" : "Log out"}
        </span>
    );
}
