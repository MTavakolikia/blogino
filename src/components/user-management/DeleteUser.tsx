"use client"

import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UserActionsProps } from "@/app/dashboard/user-management/UserActions"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
function DeleteUser({ user }: UserActionsProps) {
    const router = useRouter();
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/users/${user.id}`);
            toast.success("User deleted successfully!");
            router.refresh();
        } catch (error) {

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to delete user.");
            } else {
                toast.error("An unknown error occurred.");
            }
        }
    }
    return (
        <AlertDialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                        >
                            <Trash className="w-4 h-4" color="red" />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Delete User</p>
                </TooltipContent>
            </Tooltip>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <span className="font-bold text-cyan-600"> {user.firstName} {user.lastName} </span>
                        account and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Delete User</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteUser