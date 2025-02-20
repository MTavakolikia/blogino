"use client"

import * as React from "react"
import { BookmarkCheck, Cog, FilePlus, Heart, LayoutDashboard, LogIn, LogOut, StickyNote, User, UserCheck, UserRoundCog } from "lucide-react"
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
                                    <Link href={"/dashboard/profile"} className="flex items-center gap-2">
                                        <UserRoundCog size={18} />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/dashboard/settings"} className="flex items-center gap-2">
                                        <Cog size={18} />

                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href={"/dashboard"} className="flex items-center gap-2">
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/dashboard/my-posts"} className="flex items-center gap-2">
                                    <StickyNote size={18} />
                                    My Posts
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/dashboard/new-post"} className="flex items-center gap-2">
                                    <FilePlus size={18} />
                                    Create Post
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/dashbord/saved-post"} className="flex items-center gap-2">
                                    <BookmarkCheck size={18} />
                                    Saved Post
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={"/dashboard/liked-post"} className="flex items-center gap-2">
                                    <Heart size={18} />
                                    Liked Post
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <span onClick={clearUser} className="cursor-pointer flex items-center gap-2">
                                    <LogOut size={18} />
                                    Log out
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
