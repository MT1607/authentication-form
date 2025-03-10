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
import {getUser, requireAuth} from "@/store/slices/authSlice";
import {RootState} from "@/store";
import {Profile, reduxType, User} from "@/utils/type";
import {getProfile} from "@/store/slices/profileSlice";
import CustomToast from "@/components/custom-toast";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const dispath = useAppDispatch();
    const {response, loading, error} = useSelector((state: RootState) => state.auth as reduxType<User>);
    const {
        loading: profileLoading,
        getProfileRes: profileResponse,
        error: profileError,
    } = useSelector((state: RootState) => state.profile);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [profile, setProfile] = useState<Profile>();

    useEffect(() => {
        dispath(requireAuth());
    }, []);

    useEffect(() => {
        dispath(getUser());
    }, [authenticated]);

    useEffect(() => {
        if (user) {
            dispath(getProfile());
        }
    }, [user]);

    useEffect(() => {
        if (response?.status === 200 && response) {
            setUser(response.response?.data);
            setAuthenticated(true);
            return;
        }

        if (error?.response?.status === 402) {
            return router.push("/login");
        } else {
            return;
        }
    }, [error, loading, response]);

    useEffect(() => {
        if (profileResponse?.status === 200) {
            setProfile(profileResponse.response.data);
        }

        if (profileError) {
            CustomToast({type: {type: "error", message: profileError.message}});
        }
    }, [profileLoading, profileResponse, profileError]);

    return (
        <>
            {authenticated ?
                <div className="flex min-h-screen">
                    <SidebarProvider>
                        <AppSidebar email={user?.email || ""} profile={profile || null}/>
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