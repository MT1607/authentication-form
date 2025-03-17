"use client";

import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {Toaster} from "@/components/ui/toaster";
import {LoginForm} from "@/utils/type";
import {useAuthStore} from "@/store/auth-zustand";
import {useToastManager} from "@/hooks/use-toast-manager";


export default function LoginPage() {
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}} = useForm<LoginForm>();
    const {apiData, error, loading, postLogin} = useAuthStore();
    const {showToast} = useToastManager();

    useEffect(() => {
        if (error) {
            showToast("error", `${error.response?.data?.message}`);
        }
    }, [error]);

    useEffect(() => {
        if (apiData && apiData.response.message) {
            showToast("success", `${apiData.response.message}`);
            console.log("is here")
            router.push("/");
        }
    }, [apiData]);

    useEffect(() => {
        if (loading) {
            showToast("loading", `Logging....`);
        }
    }, [loading]);

    const onSubmit = async (data: LoginForm) => {
        await postLogin({email: data.email, password: data.password});
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and password below.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@example.com"
                                {...register("email", {required: "Email is required"})}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                {...register("password", {required: "Password is required"})}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <hr/>
                        <p className={"text-center"}>
                            Don&#39;t have account?
                            <a href={"/signup"} className={"text-blue-500"}> Register</a>
                        </p>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Toaster/>
        </div>
    );
}
