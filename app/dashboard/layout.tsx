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
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/store/hooks";
import {authState, getUser, requireAuth} from "@/store/slices/authSlice";
import {RootState} from "@/store";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const dispath = useAppDispatch();
    const {status, data, loading, error} = useSelector((state: RootState) => state.auth as authState);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        dispath(requireAuth());
    }, []);

    useEffect(() => {
        dispath(getUser());
    }, [authenticated]);

    useEffect(() => {
        if (status === 200) {
            return setAuthenticated(true);
        }

        if (error?.response?.status === 401) {
            return router.push("/login");
        } else {
            return;
        }
    }, [error, status, loading]);

    return (
        <>
            {authenticated ?
                <div className="flex min-h-screen">
                    <SidebarProvider>
                        <AppSidebar email={data?.email || ""}/>
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
                </div> : ""}
        </>
    );
}