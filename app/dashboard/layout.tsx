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
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/store/hooks";
import {getUser, requireAuth} from "@/store/slices/authSlice";
import {RootState} from "@/store";
import {Profile, User} from "@/utils/type";
import {getProfile} from "@/store/slices/profileSlice";
import CustomToast from "@/components/custom-toast";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const {response} = useSelector((state: RootState) => state.auth);
    const {
        getProfileRes: profileResponse,
        error: profileError,
    } = useSelector((state: RootState) => state.profile);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [localProfileData, setLocalProfileData] = useState<Profile | null>(null);
    const [localUserEmail, setLocalUserEmail] = useState<User | null>(null);

    useEffect(() => {
        dispatch(requireAuth());
    }, [dispatch]);

    useEffect(() => {
        const profileLocal = localStorage.getItem("profile");
        const userLocal = localStorage.getItem("user");
        if (profileLocal) setLocalProfileData(JSON.parse(profileLocal));
        if (userLocal) setLocalUserEmail(JSON.parse(userLocal));
    }, []);

    useEffect(() => {
        if (!localUserEmail) dispatch(getUser());

        if (!localProfileData) dispatch(getProfile());
    }, [localUserEmail, localProfileData, dispatch]);

    useEffect(() => {
        if (response?.status === 200 && response) {
            localStorage.setItem("user", JSON.stringify(response.response?.data));
            setLocalUserEmail(response.response?.data || null);
            setAuthenticated(true);
            return;
        }
    }, [response]);

    useEffect(() => {
        if (profileResponse?.status === 200) {
            localStorage.setItem("profile", JSON.stringify({
                first_name: profileResponse.response?.data?.first_name,
                last_name: profileResponse.response?.data?.last_name,
                avatar_url: profileResponse.response?.data?.avatar_url,
                date_of_birth: profileResponse.response?.data?.date_of_birth
            }));
            setLocalProfileData(profileResponse.response?.data || null);
            return;
        }

        if (profileError) {
            CustomToast({type: {type: "error", message: profileError.message}});
        }
    }, [profileResponse]);

    return (
        <>
            {authenticated ?
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
                </div> : ""}
        </>
    );
}