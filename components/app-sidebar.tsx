"use client"

import type * as React from "react"

import {NavMain} from "./nav-main"
import {TeamSwitcher} from "./team-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar"
import {NavUser} from "@/components/nav-user";
import {mockDataSidebar} from "@/dt/mock-data-sidebar";
import {usePathname} from "next/navigation";

// This is sample data.

export function AppSidebar({...props}: { props?: React.ComponentProps<typeof Sidebar> }) {
    const pathname = usePathname();

    const updatedNavMain = mockDataSidebar.navMain.map((item) => ({
        ...item,
        isActive: pathname.includes(item.url),
    }));

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={mockDataSidebar.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={updatedNavMain}/>
                {/*<NavProjects projects={data.projects}/>*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}

