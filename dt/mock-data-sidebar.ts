import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    SquareTerminal
} from "lucide-react";

export const mockDataSidebar = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
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
            title: "Storage",
            url: "/storage",
            icon: SquareTerminal,
            isActive: true,
            items: [
                // {
                //     title: "History",
                //     url: "#",
                // },
                // {
                //     title: "Starred",
                //     url: "#",
                // },
                // {
                //     title: "Settings",
                //     url: "#",
                // },
            ],
        },
        {
            title: "Chat With AI",
            url: "/chat",
            icon: Bot,
            items: [
                // {
                //     title: "Genesis",
                //     url: "#",
                // },
                // {
                //     title: "Explorer",
                //     url: "#",
                // },
                // {
                //     title: "Quantum",
                //     url: "#",
                // },
            ],
        },
        {
            title: "Project",
            url: "/project",
            icon: BookOpen,
            items: [
                // {
                //     title: "Introduction",
                //     url: "#",
                // },
                // {
                //     title: "Get Started",
                //     url: "#",
                // },
                // {
                //     title: "Tutorials",
                //     url: "#",
                // },
                // {
                //     title: "Changelog",
                //     url: "#",
                // },
            ],
        },
        // {
        //     title: "Settings",
        //     url: "#",
        //     icon: Settings2,
        //     items: [
        //         {
        //             title: "General",
        //             url: "#",
        //         },
        //         {
        //             title: "Team",
        //             url: "#",
        //         },
        //         {
        //             title: "Billing",
        //             url: "#",
        //         },
        //         {
        //             title: "Limits",
        //             url: "#",
        //         },
        //     ],
        // },
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
