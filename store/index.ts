import {configureStore} from "@reduxjs/toolkit";
import s3Slice from "@/store/slices/s3Slice";

const store = configureStore({
    reducer: {
        's3': s3Slice,
    }
});

export type RootState = ReturnType<typeof store.dispatch>;
export type AppDispatch = typeof store.dispatch;
export default store;