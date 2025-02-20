"use client"
import {useEffect} from "react";
import axios, {AxiosError} from "axios";
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        const requiredAuth = async () => {
            console.log("Required auth");

            try {
                const res = await axios.get("http://localhost:3001", {withCredentials: true});

                if (res.status === 200) {
                    console.log("Authenticated");
                }
            } catch (err) {
                const error = err as AxiosError;
                if (error.response?.status === 401) {
                    router.push("/login");
                } else {
                    console.log("Error:", error);
                }
            }
        };

        requiredAuth();
    }, []);

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-2xl leading-tight text-gray-900">HOME</h1>
        </div>
    );
}
