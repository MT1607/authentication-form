import {ApiResponse, OverrideAxiosError, User} from "@/utils/type";
import {create} from "zustand/react";
import axios from "axios";

interface AuthState {
    apiData: ApiResponse<User>;
    error: OverrideAxiosError | null;
    loading: boolean;

    postLogin: ({email, password}: { email: string, password: string }) => Promise<void>;
    postRegister: ({email, password}: { email: string, password: string }) => Promise<void>;
}

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const useAuthStore = create<AuthState>((set, get) => ({
    apiData: {
        status: 0,
        response: {
            message: "",
            data: {} as User,
        }
    },
    error: null,
    loading: false,

    postLogin: async ({email, password}) => {
        set({loading: true});
        try {
            const response = await axios.post(`${baseUrl}/auth/login`, {email, password}, {withCredentials: true});
            set({
                apiData: {
                    status: response.status,
                    response: {
                        message: response.data.message,
                    }
                }, loading: false
            });
        } catch (e) {
            set({error: e as OverrideAxiosError, loading: false})
        }
    },

    postRegister: async ({email, password}) => {
        set({loading: true});
        try {
            const response = await axios.post(`${baseUrl}/auth/register`, {email, password}, {withCredentials: true});
            set({
                apiData: {
                    status: response.status,
                    response: {
                        message: response.data.message,
                    }
                }, loading: false
            })
        } catch (e) {
            set({error: e as OverrideAxiosError, loading: false});
        }
    }
}))