"use client"

import { type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (

            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className={`p-0 ${isActive ? "bg-cyan-600" : ""}`}>
                    <Link href={item.url} className={`flex  items-center w-full h-full gap-2 p-2 group-data-[collapsible=icon]:p-0`}>
                      <div className="flex items-center justify-center w-4 h-4">
                        {item.icon && <item.icon size={16} />}
                      </div>
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>

                    {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
