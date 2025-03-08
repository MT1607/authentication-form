// export interface authState<T extends object> {
//     data: ApiResponse<T>,
//     error: AxiosError | null,
//     loading: boolean,
// }
//

export interface s3State {
    avatarUrl: string | null,
    loading: boolean,
    error: string | null,
    success: boolean,
}