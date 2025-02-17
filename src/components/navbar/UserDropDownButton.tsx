"use client"

import * as React from "react"
import { LogIn, User, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function UserDropDownButton() {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <User />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
