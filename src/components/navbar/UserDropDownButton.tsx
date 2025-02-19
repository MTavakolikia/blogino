"use client"

import * as React from "react"
import { LogIn, User, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import useUserStore from "@/store/userStore"

export function UserDropDownButton() {
    const { user, clearUser } = useUserStore();

    return (

        <>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <User />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {user ?
                        <>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Link href={"/dashboard/profile"}>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/dashboard/settings"}>
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href={"/dashboard"}>
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/dashboard/my-posts"}>
                                    My Posts
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/dashboard/new-post"}>
                                    Create Post
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <span onClick={clearUser} className="cursor-pointer">Log out
                                </span>
                            </DropdownMenuItem>
                        </>
                        :
                        <>
                            <DropdownMenuItem>
                                <Link href={"/login"} className="flex items-center gap-3">
                                    <LogIn size={20} />
                                    Login
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link className="flex items-center gap-3" href={"/register hover:text-cyan-800"}>
                                    <UserCheck size={20} />Signup
                                </Link>
                            </DropdownMenuItem>
                        </>}
                </DropdownMenuContent>
            </DropdownMenu>
        </>

    )
}
