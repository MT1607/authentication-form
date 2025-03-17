import {ApiResponse, OverrideAxiosError, Profile} from "@/utils/type";
import {create} from "zustand/react";
import axios from "axios";

interface ProfileState {
    apiDataProfile: ApiResponse<Profile>;
    errorProfile: OverrideAxiosError | null;
    loadingProfile: boolean;

    getProfile: () => Promise<void>
}

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const useProfileStore = create<ProfileState>((set) => ({
    apiDataProfile: {
        status: 0,
        response: {
            message: "",
            data: {} as Profile,
        }
    },
    errorProfile: null,
    loadingProfile: false,

    getProfile: async () => {
        set({loadingProfile: true});
        try {
            const response = await axios.get(`${baseUrl}/auth/profile`, {withCredentials: true});

            set({
                apiDataProfile: {
                    status: response.status,
                    response: {
                        message: response.data.message,
                        data: response.data.profile
                    }
                }, loadingProfile: false
            });
        } catch (e) {
            set({errorProfile: e as OverrideAxiosError, loadingProfile: false})
        }
    }
}))