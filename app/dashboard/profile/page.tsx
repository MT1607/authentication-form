"use client";

import {useForm} from "react-hook-form";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React, {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {uploadAvatar} from "@/store/slices/s3Slice";
import {useAppDispatch} from "@/store/hooks";
import {s3State} from "@/utils/reduxType";
import {ErrorResponse, Profile, reduxType} from "@/utils/type";
import {useToast} from "@/hooks/use-toast";
import {CheckCircleIcon, Loader2, XCircleIcon} from "lucide-react";
import {Toaster} from "@/components/ui/toaster";
import {updateProfile} from "@/store/slices/profileSlice";

const profileSchema = z.object({
    avatar: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const {toast} = useToast();

    const {avatarUrl, error, success} = useSelector((state: RootState) => state.s3 as s3State);
    const {
        error: profileError,
        loading: profileLoading,
        response: profileResponse,
    } = useSelector((state: RootState) => state.profile as reduxType<Profile>);
    const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");
    const [file, setFile] = useState<File | null>();
    const [profile, setProfile] = useState<Profile>();

    const form = useForm<z.infer<typeof profileSchema>>({ // change here
        resolver: zodResolver(profileSchema),
        defaultValues: {
            avatar: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
        },
    });

    const onSubmit = (data: Profile) => {
        if (file) {
            setProfile(data);
            dispatch(uploadAvatar(file));
        } else {
            dispatch(updateProfile({...data, avatar: ""}))
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    useEffect(() => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatarPreview(imageUrl);
            form.setValue("avatar", imageUrl);
        }
    }, [file]);

    // useEffect(() => {
    //     const getProfile = async () => {
    //         await axios.get(`${baseUrl}/profile`, {withCredentials: true})
    //             .then(res => console.log("Get profile", res))
    //             .catch(error => console.log("error get profile: ", error));
    //     }
    //     getProfile();
    // }, []);

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                description: (
                    <div>
                        <span><XCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                        <span>Can not upload avatar. Please try again.</span>
                    </div>
                )
            })
        }
        if (success) {
            if (profile) {
                dispatch(updateProfile({...profile, avatar: avatarUrl || ""}));
            }
        }
    }, [error, success]);

    useEffect(() => {
        if (profileLoading) {
            toast({
                variant: "default",
                description: (
                    <div className="flex items-center">
                        <Loader2 className="h-6 w-6 mr-2 animate-spin"/>
                        Updating....
                    </div>
                )
            })
        }

        if (profileError) {
            toast({
                variant: "destructive",
                description: (
                    <div>
                        <span><XCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                        {String((profileError?.response?.data as ErrorResponse)?.message)}
                    </div>
                )
            })
        }

        if (profileResponse?.status === 200) {
            toast({
                variant: "default",
                className: "border border-green-500 bg-green-100 text-green-700",
                description: (
                    <div>
                        <span><CheckCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                        {String(profileResponse?.response?.message)}
                    </div>
                )
            })
        }
    }, [profileResponse, profileResponse, profileError]);

    return (
        <div className="m-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={avatarPreview || avatarUrl || ""} alt="Avatar"/>
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden"
                               id="avatar"/>
                        <label htmlFor="avatar" className="cursor-pointer bg-gray-200 px-3 py-1 rounded-md">Change
                            Avatar</label>
                    </div>

                    <FormField control={form.control} name="firstName" render={({field}) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <FormField control={form.control} name="lastName" render={({field}) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <FormField control={form.control} name="dateOfBirth" render={({field}) => (
                        <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <Button type="submit">Update Profile</Button>
                </form>
            </Form>
            <Toaster/>
        </div>
    );
}
