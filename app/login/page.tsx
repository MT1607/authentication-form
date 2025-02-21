"use client";

import React from "react";
import {useForm} from "react-hook-form";
// Import các component shadcn UI (giả sử chúng được export từ "@/components/ui")
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {Toaster} from "@/components/ui/toaster";
import {CheckCircleIcon, XCircleIcon} from "lucide-react";

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const {toast} = useToast();
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        await axios.post(`${baseUrl}/login`, {
            email: data.email,
            password: data.password
        }, {withCredentials: true}).then(() => {
            toast({
                variant: "default",
                className: "border border-green-500 bg-green-100 text-green-700",
                description: (
                    <div>
                        <span><CheckCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                        Login successfully.
                    </div>
                )
            })
            router.push("/");
        }).catch(err => {
            console.log(err.response.data);
            if (err.status === 400) {
                switch (err.response.data) {
                    case "Email incorrect":
                        console.log("Email incorrect");
                        toast({
                            variant: "destructive",
                            description: (
                                <div>
                                    <span><XCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                                    {err.response.data}
                                </div>
                            )
                        })
                        break;
                    case "Password incorrect":
                        toast({
                            variant: "destructive",
                            description: (
                                <div>
                                    <span><XCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                                    {err.response.data}
                                </div>
                            )
                        })
                        break;
                    default:
                        break;
                }
            }
        });
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
