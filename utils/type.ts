import {AxiosError} from "axios";

export interface User {
    email: string;
}

export interface Profile {
    avatar_url?: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    date_of_birth: string | undefined;
}

export interface LoginForm {
    email: string;
    password: string;
}


export interface ApiResponse<T extends object> {
    status: number,
    response: {
        data?: T,
        message: string,
    }
}

export interface reduxType<T extends object> {
    response: ApiResponse<T> | null;
    error: AxiosError | null;
    loading: boolean;
}

export interface ErrorResponse {
    message: string;
}