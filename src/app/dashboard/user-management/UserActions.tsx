"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2, UserCog, Shield, Ban } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface User {
    id: string;
    role: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface UserActionsProps {
    user: User;
}

export default function UserActions({ user }: UserActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = async (newRole: string) => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/users/${user.id}`, {
                role: newRole,
            });
            toast.success("User role updated successfully");
        } catch (error) {
            console.error("Failed to update user role:", error);
            toast.error("Failed to update user role");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeactivate = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/users/${user.id}`, {
                active: false,
            });
            toast.success("User deactivated successfully");
        } catch (error) {
            console.error("Failed to deactivate user:", error);
            toast.error("Failed to deactivate user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={isLoading}
                >
                    <Settings2 className="w-4 h-4 mr-2" />
                    Manage User
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")}>
                    <Shield className="w-4 h-4 mr-2" />
                    Make Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange("AUTHOR")}>
                    <UserCog className="w-4 h-4 mr-2" />
                    Make Author
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange("USER")}>
                    <UserCog className="w-4 h-4 mr-2" />
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
    );
}