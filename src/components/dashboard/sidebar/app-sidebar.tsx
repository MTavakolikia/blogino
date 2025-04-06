"use client"
import {
    AudioWaveform,
    BookmarkCheck,
    Command,
    FilePlus,
    Frame,
    GalleryVerticalEnd,
    Heart,
    LayoutDashboard,
    Map,
    PieChart,
    Rss,
    StickyNote,
    Tag,
    User,
} from "lucide-react"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import routes from "@/config/routes"
import Link from "next/link"

const data = {
    user: {
        name: "profile",
        email: "mohammad@gmail.com",
        avatar: "/profile.png",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: routes.dashboard,
            icon: LayoutDashboard,
            isActive: true,
            // items: [
            //     {
            //         title: "History",
            //         url: "#",
            //     },
            //     {
            //         title: "Starred",
            //         url: "#",
            //     },
            //     {
            //         title: "Settings",
            //         url: "#",
            //     },
            // ],
        },
        {
            title: "My Posts",
            url: routes.posts.root,
            icon: StickyNote,
        },
        {
            title: "Create New Post",
            url: routes.posts.new,
            icon: FilePlus,
        },
        {
            title: "Saved Post",
            url: routes.savedPost,
            icon: BookmarkCheck,
        },
        {
            title: "Categories",
            url: routes.categories,
            icon: Tag,
        },
        {
            title: "Liked Post",
            url: routes.likedPost,
            icon: Heart,
        },
        {
            title: "User Management",
            url: routes.userManagement,
            icon: User,
        },

    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Link href={routes.home} className="flex mt-1 items-center justify-center text-2xl gap-2 bg-gradient-to-r from-cyan-100 to-cyan-500 bg-clip-text text-transparent">
                    <Rss color="white" size={26} />
                    <span>Blogino</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
