import {AxiosError} from "axios";

export interface User {
    email: string;
}

export interface Profile {
    avatar?: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    dateOfBirth: string | undefined;
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