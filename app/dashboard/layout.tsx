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
import axios, {AxiosError} from "axios";
import {User} from "@/utils/type";
import {Provider} from "react-redux";
import store from "@/store";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const [error, setError] = useState<AxiosError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User>();

    const baseUrl = process.env.NEXT_PUBLIC_URL_API;

    useEffect(() => {
        const requiredAuth = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${baseUrl}`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setAuthenticated(true);
                }
            } catch (err) {
                const error = err as AxiosError;
                if (error.response?.status === 401) {
                    router.push("/login");
                } else {
                    console.log("Error:", error);
                    setError(error);
                }
            } finally {
                setLoading(false);
            }
        };

        requiredAuth();
    }, []);

    useEffect(() => {
        const getUser = async () => {
            await axios.get(`${baseUrl}/user`, {withCredentials: true})
                .then(res => setUser(res.data.user))
                .catch(err => console.log(err));
        }

        getUser();
    }, [authenticated]);


    return (
        <Provider store={store}>
            {authenticated ?
                <div className="flex min-h-screen">
                    <SidebarProvider>
                        <AppSidebar email={user?.email}/>
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
        </Provider>
    );
}