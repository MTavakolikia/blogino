"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, UserPen, UserCheck, Ban, Shield, Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import UserProfileDialog from "@/components/user-management/UserProfileDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profilePic: string | null;
    bio?: string;
    createdAt: Date;
    _count?: {
        posts: number;
    };
}

interface UserActionsProps {
    user: User;
}

export default function UserActions({ user }: UserActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const handleRoleChange = async (newRole: string) => {
        setIsLoading(true);
        try {
            await axios.patch(`/api/users/${user.id}`, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeactivate = async () => {
        setIsLoading(true);
        try {
            await axios.patch(`/api/users/${user.id}`, { active: false });
            toast.success("User account deactivated");
        } catch (error) {
            console.error("Error deactivating user:", error);
            toast.error("Failed to deactivate user");
        } finally {
            setIsLoading(false);
        }
    };


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
                            onClick={handleDeactivate}
                            className="text-destructive"
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            Deactivate Account
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="border-red-700" disabled={isLoading}>
                            <Trash className="w-4 h-4" color="red" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete User</p>
                    </TooltipContent>
                </Tooltip>
            </div>

        </div>
    );
}