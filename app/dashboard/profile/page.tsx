"use client";

import {useForm} from "react-hook-form";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {uploadAvatar} from "@/store/slices/s3Slice";
import {Profile} from "@/utils/type";
import {useAppDispatch} from "@/store/hooks";
import axios from "axios";
import {s3State} from "@/utils/reduxType";


const profileSchema = z.object({
    avatar: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const {avatarUrl, loading, error, success} = useSelector((state: RootState) => state.s3 as s3State);
    const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");
    const [file, setFile] = useState<File | null>();
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            avatar: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
        },
    });

    const onSubmit = (data: Profile) => {
        console.log("Updated Profile:", data, "avatar: ", data.avatar);
        if (file) {
            dispatch(uploadAvatar(file));
            console.log("error: ", error, "avatar: ", avatarUrl, "success: ", success, "loading: ", loading);
            if (error) {
                console.log("Error:", error);
            }
            if (success) {
                console.log("Upload success: ", avatarUrl, success);
            }
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

    useEffect(() => {
        const getProfile = async () => {
            await axios.get(`${baseUrl}/profile`, {withCredentials: true})
                .then(res => console.log("Get profile", res))
                .catch(error => console.log("error get profile: ", error));
        }
        getProfile();
    }, []);

    return (
        <div className="m-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={avatarPreview || avatarUrl} alt="Avatar"/>
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
        </div>
    );
}
