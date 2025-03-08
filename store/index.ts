import {configureStore} from "@reduxjs/toolkit";
import s3Slice from "@/store/slices/s3Slice";
import authSlice from "@/store/slices/authSlice";
import profileSlice from "@/store/slices/profileSlice";

const store = configureStore({
    reducer: {
        's3': s3Slice,
        'auth': authSlice,
        'profile': profileSlice,
    }
});

export type RootState = ReturnType<typeof store.dispatch>;
export type AppDispatch = typeof store.dispatch;
export default store;