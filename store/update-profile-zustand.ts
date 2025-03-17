import {ApiResponse, OverrideAxiosError, Profile} from "@/utils/type";
import {create} from "zustand/react";
import axios from "axios";

interface ProfileState {
    apiUpdateProfile: ApiResponse<Profile>;
    errorUpdateProfile: OverrideAxiosError | null;
    loadingUpdateProfile: boolean;

    updateProfile: ({body}: { body: Profile }) => Promise<void>
    clearError: () => void

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

    updateProfile: async ({body}) => {
        set({loadingUpdateProfile: true});
        try {
            const response = await axios.put(`${baseUrl}/auth/profile`, {
                firstName: body.first_name,
                lastName: body.last_name,
                avatarUrl: body.avatar_url,
                dateOfBirth: body.date_of_birth
            }, {withCredentials: true});
            set({
                apiUpdateProfile: {
                    status: response.status,
                    response: {
                        message: response.data.message,
                    }
                }, loadingUpdateProfile: false
            })
        } catch (e) {
            set({errorUpdateProfile: e as OverrideAxiosError, loadingUpdateProfile: false});
        }
    },

    clearError: () => set({errorUpdateProfile: null}),

}))