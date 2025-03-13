"use client"

import {Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, User} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar"
import {useRouter} from "next/navigation";
import {useProfileContext} from "@/context/context-provider";


export function NavUser() {
    const {isMobile} = useSidebar();
    const router = useRouter();
    //
    // const [user, setUser] = useState({email: ""});
    // const [profile, setProfile] = useState({first_name: "", last_name: "", avatar_url: ""});
    //
    // const loadDataFromStorage = () => {
    //     const storedUser = localStorage.getItem("user");
    //     const storedProfile = localStorage.getItem("profile");
    //     if (storedUser && storedProfile) {
    //         const profileDt = JSON.parse(storedProfile);
    //         setUser(JSON.parse(storedUser));
    //         setProfile({
    //             first_name: profileDt.first_name,
    //             last_name: profileDt.last_name,
    //             avatar_url: profileDt.avatar_url
    //         });
    //     } else {
    //         setUser(defaultUser);
    //         setProfile(defaultProfile);
    //     }
    // }
    // useEffect(() => {
    //     console.log("set window event");
    //
    //     loadDataFromStorage();
    //
    //     const handelStorageChange = (event: StorageEvent) => {
    //         console.log("Handel Storage change", event);
    //         if (event.key === "profile") {
    //             console.log(profile);
    //             loadDataFromStorage();
    //         }
    //     }
    //
    //     window.addEventListener("storage", handelStorageChange);
    //     return () => {
    //         window.removeEventListener("storage", handelStorageChange);
    //     }
    // }, []);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const {profileContext} = useProfileContext();
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
                                <AvatarImage src={profileContext?.avatar_url}
                                             alt={`${profileContext?.first_name} ${profileContext?.last_name}`}/>
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span
                                    className="truncate font-semibold">{`${profileContext?.first_name} ${profileContext?.last_name}`}</span>
                                <span className="truncate text-xs">{user?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
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
                                    <AvatarImage src={profileContext?.avatar_url}
                                                 alt={`${profileContext?.first_name} ${profileContext?.last_name}`}/>
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span
                                        className="truncate font-semibold">{`${profileContext?.first_name} ${profileContext?.last_name}`}</span>
                                    <span className="truncate text-xs">{user?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles/>
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                                <User/>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard/>
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell/>
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <LogOut/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

