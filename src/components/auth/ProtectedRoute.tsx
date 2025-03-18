"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/userStore";
import { hasPermission } from "@/utils/permissions";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: "create:post" | "edit:post" | "delete:post" | "manage:users" | "approve:post";
    requiredRoles?: string[];
}

export default function ProtectedRoute({
    children,
    requiredPermission,
    requiredRoles,
}: ProtectedRouteProps) {
    const router = useRouter();
    const { user } = useUserStore();

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (requiredRoles && !requiredRoles.includes(user.role)) {
            router.push("/unauthorized");
            return;
        }

        if (requiredPermission && !hasPermission(user, requiredPermission)) {
            router.push("/unauthorized");
            return;
        }
    }, [user, router, requiredPermission, requiredRoles]);

    if (!user) return null;

    return <>{children}</>;
}