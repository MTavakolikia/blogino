"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, UserPen, UserCheck, Ban, Shield } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import UserProfileDialog from "@/components/user-management/UserProfileDialog";
import DeleteUser from "@/components/user-management/DeleteUser";
import { useRouter } from "next/navigation";
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profilePic: string | null;
    bio?: string;
    createdAt: Date;
    active: boolean;
    _count?: {
        posts: number;
    };
}

export interface UserActionsProps {
    user: User;
}

export default function UserActions({ user }: UserActionsProps) {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleRoleChange = async (newRole: string) => {
        setIsLoading(true);
        try {
            await axios.patch(`/api/users/${user.id}`, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            router.refresh();
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role");
        } finally {
            setIsLoading(false);
        }
    };

    const handleActiveOrDeactivate = async (userStatus: boolean) => {
        setIsLoading(true);
        try {
            await axios.patch(`/api/users/${user.id}`, { active: userStatus });
            toast.success(`User account ${userStatus ? "activated" : "deactivated"}`);
            router.refresh();
        } catch (error) {
            console.error(`Error ${userStatus ? "activating" : "deactivating"} user:`, error);
            toast.error(`Failed to ${userStatus ? "activate" : "deactivate"} user`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <UserProfileDialog user={user} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <DropdownMenuTrigger asChild>

                            <Button
                                variant="outline"
                                size="icon"
                                disabled={isLoading}
                            >
                                <Shield className="h-2 w-2" />
                            </Button>
                        </DropdownMenuTrigger>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")}>
                            <Shield className="w-4 h-4 mr-2" />
                            Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange("AUTHOR")}>
                            <UserPen className="w-4 h-4 mr-2" />
                            Make Author
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange("USER")}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Make User
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleActiveOrDeactivate(!user.active)}
                            className={`${user.active ? "text-destructive" : "text-green-500"}`}
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            {`${user.active ? "Deactivate" : "Activate"} Account`}
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <DeleteUser user={user} />

        </div>
    );
}