"use client"
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {useEffect} from "react";
import {useUserStore} from "@/store/user-zustand";
import {useProfileStore} from "@/store/profile-zustand";
import {useLocalContext} from "@/context/context-provider";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const {userContext, profileContext} = useLocalContext();

    const {apiDataUser, getUser} = useUserStore();
    const {apiDataProfile, getProfile} = useProfileStore();

    const {updateProfileContext} = useLocalContext();
    const {updateUserContext} = useLocalContext();

    useEffect(() => {
        if (!profileContext) {
            (async () => {
                await getProfile();
            })()
        }
    }, []);

    useEffect(() => {
        if (apiDataProfile.status === 200) {
            updateProfileContext({
                avatar_url: apiDataProfile.response.data?.avatar_url,
                first_name: apiDataProfile.response.data?.first_name,
                last_name: apiDataProfile.response.data?.last_name,
                date_of_birth: apiDataProfile.response.data?.date_of_birth
            });
        }
    }, [apiDataProfile]);

    useEffect(() => {
        if (!userContext) {
            (async () => {
                await getUser();
            })()
        }
    }, []);

    useEffect(() => {
        if (apiDataUser.status === 200) {
            updateUserContext({email: apiDataUser.response.data?.email})
        }
    }, [apiDataUser]);

    return (
        <>
            <div className="flex min-h-screen">
                <SidebarProvider>
                    <AppSidebar/>
                    <SidebarInset>
                        <header
                            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1"/>
                                <Separator orientation="vertical" className="mr-2 h-4"/>
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block"/>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                        </header>
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </>
    );
}