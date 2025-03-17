"use client";

import {useForm} from "react-hook-form";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React, {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Profile} from "@/utils/type";
import {Toaster} from "@/components/ui/toaster";
import {formatDateToInput} from "@/utils/scripts";
import SessionExpiredCard from "@/components/end-session-card";
import {useLocalContext} from "@/context/context-provider";
import {useS3Store} from "@/store/s3-zustand";
import {useToastManager} from "@/hooks/use-toast-manager";
import {useUpdateProfileStore} from "@/store/update-profile-zustand";

const profileSchema = z.object({
    avatar_url: z.string().optional(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
});

export default function ProfilePage() {
    const {updateProfileContext} = useLocalContext();

    const [sessionExpired, setSessionExpired] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    const {error, uploadAvatar, avatarUrl} = useS3Store();
    const {
        apiUpdateProfile,
        errorUpdateProfile,
        loadingUpdateProfile,
        updateProfile,
        clearError
    } = useUpdateProfileStore();

    const {showToast} = useToastManager();
    const {profileContext} = useLocalContext();


    const form = useForm<z.infer<typeof profileSchema>>({ // change here
        resolver: zodResolver(profileSchema),
        defaultValues: {
            avatar_url: profileContext?.avatar_url || "",
            first_name: profileContext?.first_name || "",
            last_name: profileContext?.last_name || "",
            date_of_birth: formatDateToInput(profileContext?.date_of_birth || ""),
        },
    });

    const onSubmit = async (data: Profile) => {
        if (avatar) {
            await uploadAvatar(avatar);
        } else {
            console.log("update profile don't have avatar url")
            await updateProfile({body: {...data, avatar_url: profileContext?.avatar_url || ""}});
            const cloneProfileContext = {...profileContext};
            updateProfileContext({
                avatar_url: cloneProfileContext?.avatar_url || "",
                first_name: data.first_name,
                last_name: data.last_name,
                date_of_birth: data.date_of_birth,
            })
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setAvatar(event.target.files[0]);
        }
    };

    useEffect(() => {
        if (avatar) {
            const imageUrl = URL.createObjectURL(avatar);
            setAvatarPreview(imageUrl);
            form.setValue("avatar_url", imageUrl);
        }
    }, [avatar]);

    useEffect(() => {
        if (error) {
            showToast("error", "Can not upload avatar. Please try again !")
        }

        if (avatarUrl) {
            (async () => {
                console.log("update profile have avatar url", avatarUrl);
                await updateProfile({body: {...form.getValues(), avatar_url: avatarUrl}});
            })()
        }
    }, [error, avatarUrl]);

    useEffect(() => {
        if (errorUpdateProfile) {
            if (errorUpdateProfile.response?.status === 401) {
                console.log("session expired")
                setSessionExpired(true);
            } else {
                showToast("error", `${errorUpdateProfile.response?.data?.message}`);
            }
            clearError();
        }

        if (loadingUpdateProfile) {
            setIsUpdate(true);
            showToast("loading", "Updating...")
        }

        if (apiUpdateProfile.status === 200) {
            updateProfileContext({
                avatar_url: avatarUrl || "",
                first_name: form.getValues().first_name || "",
                last_name: form.getValues().last_name || "",
                date_of_birth: form.getValues().date_of_birth || "",
            })
            showToast("success", `${apiUpdateProfile.response.message}`);
            setIsUpdate(false);
        }
    }, [errorUpdateProfile, loadingUpdateProfile, apiUpdateProfile]);


    return (
        <div className="m-6">
            {sessionExpired && <SessionExpiredCard/>}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={avatarPreview ?? profileContext?.avatar_url}
                                         alt="Avatar"/>
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

                    <Button type="submit" disabled={isUpdate}>
                        {isUpdate ? "Updating..." : "Update Profile"}
                    </Button>
                </form>
            </Form>
            <Toaster/>
        </div>
    );
}
