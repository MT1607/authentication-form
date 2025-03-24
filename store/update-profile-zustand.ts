import {ApiResponse, OverrideAxiosError, Profile} from "@/utils/type";
import {create} from "zustand/react";
import axios from "axios";

interface ProfileState {
    apiUpdateProfile: ApiResponse<Profile>;
    errorUpdateProfile: OverrideAxiosError | null;
    loadingUpdateProfile: boolean;

    updateProfile: (data: {
        firstName: string,
        lastName: string,
        dateOfBirth: string,
        avatarFile?: File | null,
        avatarUrl?: string | null
    }) => Promise<void>;
    clearError: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const useUpdateProfileStore = create<ProfileState>((set) => ({
    apiUpdateProfile: {
        status: 0,
        response: {
            message: "",
            data: {} as Profile,
        }
    },
    errorUpdateProfile: null,
    loadingUpdateProfile: false,

    updateProfile: async ({firstName, lastName, dateOfBirth, avatarFile, avatarUrl}) => {
        set({loadingUpdateProfile: true});

        try {
            const formData = new FormData();
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("date_of_birth", dateOfBirth);

            // Handle avatar cases:
            // 1. If new file is provided, add it to formData
            // 2. If avatarUrl is provided (could be null to remove existing avatar), add it to formData
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            } else if (avatarUrl !== undefined) {
                formData.append("avatar_url", avatarUrl || "");
            }

            const response = await axios.put(`${baseUrl}/auth/profile`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            set({
                apiUpdateProfile: {
                    status: response.status,
                    response: {
                        message: response.data.message,
                        data: response.data.data || {} as Profile,
                    }
                },
                loadingUpdateProfile: false
            });

        } catch (e) {
            set({errorUpdateProfile: e as OverrideAxiosError, loadingUpdateProfile: false});
        }
    },

    clearError: () => set({errorUpdateProfile: null}),
}));