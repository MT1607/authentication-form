import {AxiosError} from "axios";

export interface User {
    email: string | undefined;
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

// export type OverideAxios<T = ErrorResponse> = AxiosError<T>

export interface OverrideAxiosError<T = unknown> extends AxiosError<T> {
    response?: AxiosError<T>["response"] & {
        data?: T & { message?: string } // Thêm message vào response.data
    };
}

export interface ApiResponse<T extends object | null> {
    status: number,
    response: {
        data?: T,
        message: string,
    }
}

export interface reduxType<T extends object> {
    apiData: ApiResponse<T> | null;
    error: OverrideAxiosError | null;
    loading: boolean;
}

