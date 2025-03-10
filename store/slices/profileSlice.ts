import {ApiResponse, OverrideAxiosError, Profile} from "@/utils/type";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    getProfileRes: null as ApiResponse<Profile> | null,
    updateProfileRes: null as ApiResponse<Profile> | null,

    getProfileLoading: false,
    updateProfileLoading: false,

    error: null as OverrideAxiosError | null,
}

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const getProfile = createAsyncThunk(
    "profile/getProfile",
    async (_, {rejectWithValue}) => {
        try {
            const res = await axios.get(`${baseUrl}/profile`, {withCredentials: true});
            return {response: {message: res.data.message, data: res.data.profile || null}, status: res.status};
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);
export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (value: Profile, {rejectWithValue}) => {
        try {
            const res = await axios.put(`${baseUrl}/profile`, {
                firstName: value.first_name,
                lastName: value.last_name,
                avatarUrl: value.avatar_url,
                dateOfBirth: value.date_of_birth
            }, {withCredentials: true});
            return {response: {message: res.data.message, data: res.data.profile || null}, status: res.status};
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProfile.pending, (state) => {
            state.getProfileLoading = true;
            state.error = null;
            state.getProfileRes = null;
        });
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.getProfileLoading = false;
            state.error = null;
            state.getProfileRes = action.payload;
        });
        builder.addCase(getProfile.rejected, (state, action) => {
            state.getProfileLoading = false;
            state.error = action.payload as OverrideAxiosError;
            state.getProfileRes = null;
        });


        builder.addCase(updateProfile.pending, (state) => {
            state.updateProfileLoading = true;
            state.error = null;
            state.updateProfileRes = null;
        });
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.updateProfileLoading = false;
            state.error = null;
            state.updateProfileRes = action.payload;
        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.updateProfileLoading = false;
            state.error = action.payload as OverrideAxiosError;
            state.updateProfileRes = null;
        });
    }
});

export default profileSlice.reducer;
