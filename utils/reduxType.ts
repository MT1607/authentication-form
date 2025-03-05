import {User} from "@/utils/type";
import {AxiosError} from "axios";


export interface authState {
    data: User | null,
    error: AxiosError | null,
    success: boolean,
    loading: boolean,
    status: number | null,
}


export interface s3State {
    avatarUrl: string | null,
    loading: boolean,
    error: string | null,
    success: boolean,
}