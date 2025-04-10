import { User } from "@/types/user";

type Role = "ADMIN" | "AUTHOR" | "USER";
type Permission = "create:post" | "edit:post" | "delete:post" | "manage:users" | "approve:post";

const permissionsByRole: Record<Role, Permission[]> = {
    ADMIN: [
        "create:post",
        "edit:post",
        "delete:post",
        "manage:users",
        "approve:post",
    ],
    AUTHOR: ["create:post", "edit:post"],
    USER: [],
};

export const hasPermission = (user: User | null, permission: Permission): boolean => {
    if (!user) return false;
    return permissionsByRole[user.role]?.includes(permission) || false;
};

export const canManagePost = (user: User | null, authorId: string): boolean => {
    if (!user) return false;
    return user.role === "ADMIN" || user.id === authorId;
};

export const canApprovePost = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === "ADMIN";
};
