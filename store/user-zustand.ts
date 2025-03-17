import {ApiResponse, OverrideAxiosError, User} from "@/utils/type";
import {create} from "zustand/react";
import axios from "axios";

interface UserState {
    apiDataUser: ApiResponse<User>;
    errorUser: OverrideAxiosError | null;
    loadingUser: boolean;

    getUser: () => Promise<void>
}

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const useUserStore = create<UserState>((set, get) => ({
    apiDataUser: {
        status: 0,
        response: {
            message: "",
            data: {} as User,
        }
    },
    errorUser: null,
    loadingUser: false,

    getUser: async () => {
        set({loadingUser: true});
        try {
            const response = await axios.get(`${baseUrl}/auth/user`, {withCredentials: true});

            set({
                apiDataUser: {
                    status: response.status,
                    response: {
                        message: response.data.message,
                        data: response.data.user
                    }
                }, loadingUser: false
            });
        } catch (e) {
            set({errorUser: e as OverrideAxiosError, loadingUser: false})
        }
    }
}))