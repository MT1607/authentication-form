"use client";

import React from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import axios from "axios";
import {useRouter} from "next/navigation";
import {Toaster} from "@/components/ui/toaster";
import {useToast} from "@/hooks/use-toast";
import {CheckCircleIcon, XCircleIcon} from "lucide-react";

interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function SignupPage() {
    const {toast} = useToast();
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<SignupFormData>();

    const onSubmit = async (data: SignupFormData) => {
        try {
            const response = await axios.post(`${baseUrl}/register`, {
                email: data.email, password: data.password,
            }, {withCredentials: true});

            console.log(response);

            if (response.status === 200) {
                toast({
                    variant: "default",
                    className: "border border-green-500 bg-green-100 text-green-700",
                    description: (
                        <div>
                            <span><CheckCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                            Register successfully.
                        </div>
                    )
                })
                router.push("/");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: (
                    <div>
                        <span><XCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                        {error.response.data}
                    </div>
                )
            })
        }
    };

    const password = watch("password");

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Create an account by entering your details.
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
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="********"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                        <hr/>
                        <p className={"text-center"}>Have account ? <a href={"/login"}
                                                                       className={"text-blue-500"}>Log-in</a>
                        </p>
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Toaster/>
        </div>
    );
}
