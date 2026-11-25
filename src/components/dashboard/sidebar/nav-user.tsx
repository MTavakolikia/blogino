"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  Cog,
  LogOut,
  User as UserIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import useUserStore from "@/store/userStore"
import Link from "next/link"
import { useEffect, useState } from "react"
import routes from "@/config/routes"
import { SignOutButton } from "@/components/root/navbar/SignOutButton"

function initials(name?: string) {
  return (
    name
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user } = useUserStore()
  // The user is restored from browser storage after hydration. Rendering it
  // during the first pass would produce a server/client text mismatch, so the
  // avatar starts as a neutral placeholder and fills in once mounted.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const activeUser = mounted ? user : null
  const name = activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : ""

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={activeUser?.profilePic ?? undefined} alt={name} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {initials(name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name || "Not signed in"}</span>
                <span className="truncate text-xs">{activeUser?.email ?? "Sign in"}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={activeUser?.profilePic ?? undefined} alt={name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    {initials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name || "Not signed in"}</span>
                  <span className="truncate text-xs">{activeUser?.email ?? "Sign in"}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href={routes.profile} className="flex items-center gap-2">
                  <UserIcon />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={routes.settings} className="flex items-center gap-2">
                  <Cog size={18} />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={routes.dashboard} className="flex items-center gap-2">
                  <BadgeCheck />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton className="flex items-center gap-2" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

