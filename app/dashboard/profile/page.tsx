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
import {Profile} from "@/utils/type";
import {Toaster} from "@/components/ui/toaster";
import {updateProfile} from "@/store/slices/profileSlice";
import CustomToast from "@/components/custom-toast";

const profileSchema = z.object({
    avatar_url: z.string().optional(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
});

export default function ProfilePage() {
    const dispatch = useAppDispatch();

    const {avatarUrl, error, success} = useSelector((state: RootState) => state.s3 as s3State);
    const {
        error: profileError,
        updateProfileLoading: profileLoading,
        updateProfileRes: profileResponse,
    } = useSelector((state: RootState) => state.profile);
    const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");
    const [file, setFile] = useState<File | null>();
    const [profile, setProfile] = useState<Profile>();

    const form = useForm<z.infer<typeof profileSchema>>({ // change here
        resolver: zodResolver(profileSchema),
        defaultValues: {
            avatar_url: "",
            first_name: "",
            last_name: "",
            date_of_birth: "",
        },
    });

    const onSubmit = (data: Profile) => {
        if (file) {
            setProfile(data);
            dispatch(uploadAvatar(file));
        } else {
            dispatch(updateProfile({...data, avatar_url: ""}))
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
            form.setValue("avatar_url", imageUrl);
        }
    }, [file]);

    useEffect(() => {
        if (error) {
            CustomToast({type: {type: "error", message: "Can not upload avatar. Please try again !"}})
        }
        if (success && profile) {
            dispatch(updateProfile({...profile, avatar_url: avatarUrl || ""}));
        }
    }, [error, success]);

    useEffect(() => {
        if (profileLoading) {
            CustomToast({type: {type: "loading", message: "Updating..."}})
        }

        if (profileError) {
            CustomToast({type: {type: "error", message: String((profileError?.response?.data)?.message)}})
        }

        if (profileResponse?.status === 200) {
            CustomToast({type: {type: "success", message: String(profileResponse?.response?.message)}})
        }
    }, [profileResponse, profileLoading, profileError]);

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

                    <FormField control={form.control} name="first_name" render={({field}) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <FormField control={form.control} name="last_name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <FormField control={form.control} name="date_of_birth" render={({field}) => (
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
