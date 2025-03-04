import {LoginData, User} from "@/utils/type";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authState} from "@/utils/reduxType";


const initialState: authState = {
    data: null,
    error: null,
    success: false,
    loading: false,
    status: null
}

const baseUrl = process.env.NEXT_PUBLIC_URL_API;

export const requireAuth = createAsyncThunk(
    "auth/requireAuth",
    async (_, {rejectWithValue}) => {
        try {
            const res = await axios.get(`${baseUrl}`, {withCredentials: true});
            return res.status;
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
            return res.data;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
);

export const postLogin = createAsyncThunk(
    "auth/postLogin",
    async (value: LoginData, {rejectWithValue}) => {
        console.log("value: ", value, "base url: ", baseUrl);
        try {
            const res = await axios.post(`${baseUrl}/login`, {
                email: value.email,
                password: value.password
            }, {withCredentials: true});
            return res.status;
        } catch (e) {
            return rejectWithValue(e);
        }
    }
)

export const postRegister = createAsyncThunk(
    'auth/postRegister',
    async (value: LoginData, {rejectWithValue}) => {
        try {
            const res = await axios.post(`${baseUrl}/register`, {
                email: value.email,
                password: value.password
            }, {withCredentials: true})
            return res.status;
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
            state.success = false;
        });
        builder.addCase(requireAuth.fulfilled, (state, action) => {
            state.loading = false;
            state.status = action.payload as number;
            state.success = true;
        })
        builder.addCase(requireAuth.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as AxiosError;
            state.success = false;
        });

        // GET USER
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
            state.success = false;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.user as User;
            state.status = action.payload.status as number;
            state.success = true;
        });
        builder.addCase(getUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as AxiosError;
            state.success = false;
        });

        // LOGIN
        builder.addCase(postLogin.pending, (state) => {
            state.loading = true;
            state.success = false;
        });
        builder.addCase(postLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.status = action.payload as number;
            state.success = true;
        });
        builder.addCase(postLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as AxiosError;
            state.success = false;
        });

        // REGISTER
        builder.addCase(postRegister.pending, (state) => {
            state.loading = true;
            state.success = false;
        });
        builder.addCase(postRegister.fulfilled, (state, action) => {
            state.loading = false;
            state.status = action.payload as number;
            state.success = true;
        });
        builder.addCase(postRegister.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as AxiosError;
            state.success = false;
        });
    }
});

export default authSlice.reducer;