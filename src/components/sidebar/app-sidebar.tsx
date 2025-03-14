"use client"
import {
    AudioWaveform,
    BookmarkCheck,
    Cog,
    Command,
    FilePlus,
    Frame,
    GalleryVerticalEnd,
    Heart,
    LayoutDashboard,
    Map,
    PieChart,
    StickyNote,
    Tag,
} from "lucide-react"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import routes from "@/config/routes"

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
            title: "Settings",
            url: routes.settings,
            icon: Cog,

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
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
