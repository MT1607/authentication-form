import {LoginForm, OverrideAxiosError, reduxType, User} from "@/utils/type";
import axios from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState: reduxType<User> = {
    response: null,
    error: null,
    loading: false,
}

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const requireAuth = createAsyncThunk(
    "auth/requireAuth",
    async (_, {rejectWithValue}) => {
        try {
            const res = await axios.get(`${baseUrl}`, {withCredentials: true});
            return {response: {message: res.data.message, data: res.data.user || null}, status: res.status};
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const getUser = createAsyncThunk(
    "auth/getUser",
    async (_, {rejectWithValue}) => {
        try {
            const res = await axios.get(`${baseUrl}/user`, {withCredentials: true});
            return {response: {message: res.data.message, data: res.data.user || null}, status: res.status};
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const postLogin = createAsyncThunk(
    "auth/postLogin",
    async (value: LoginForm, {rejectWithValue}) => {
        try {
            const res = await axios.post(`${baseUrl}/login`, {
                email: value.email,
                password: value.password
            }, {withCredentials: true});
            return {response: {message: res.data.message, data: res.data.user || null}, status: res.status};
        } catch (e) {
            return rejectWithValue(e);
        }
    }
)

export const postRegister = createAsyncThunk(
    'auth/postRegister',
    async (value: LoginForm, {rejectWithValue}) => {
        try {
            const res = await axios.post(`${baseUrl}/register`, {
                email: value.email,
                password: value.password
            }, {withCredentials: true});
            return {response: {message: res.data.message, data: res.data.user || null}, status: res.status};
        } catch (e) {
            return rejectWithValue(e);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // REQUIRE AUTH
        builder.addCase(requireAuth.pending, (state) => {
            state.loading = true;
            state.response = null;
            state.error = null;
        });
        builder.addCase(requireAuth.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.response = action.payload;
        })
        builder.addCase(requireAuth.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as OverrideAxiosError;
            state.response = null;
        });

        // GET USER
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
            state.response = null;
            state.error = null;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.response = action.payload;
            state.error = null
        });
        builder.addCase(getUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as OverrideAxiosError;
            state.response = null;
        });

        // LOGIN
        builder.addCase(postLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.response = null;
        });
        builder.addCase(postLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.response = action.payload;
            console.log("success: ", state.response);
        });
        builder.addCase(postLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as OverrideAxiosError;
            state.response = null;
        });

        // REGISTER
        builder.addCase(postRegister.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.response = null;
        });
        builder.addCase(postRegister.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.response = action.payload;
        });
        builder.addCase(postRegister.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as OverrideAxiosError;
            state.response = null;
        });
    }
});

export default authSlice.reducer;