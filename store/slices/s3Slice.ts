import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import s3Client from "@/lib/s3Config";
import {PutObjectCommand} from "@aws-sdk/client-s3";

interface s3State {
    avatarUrl: string | null,
    loading: boolean,
    error: string | null,
    success: boolean,
}

const initialState: s3State = {
    avatarUrl: null,
    loading: false,
    error: null,
    success: false,
}

export const uploadAvatar = createAsyncThunk(
    "s3/uploadAvatar",
    async (file: File, {rejectWithValue}) => {
        try {
            const [fileName] = file.name.split('.');
            const uniqueFileName = `avatar-${Date.now() + "-" + fileName}`
            const fileBuffer = await file.arrayBuffer();
            const params = {
                Bucket: 'mt1607-bucket',
                Key: uniqueFileName,
                Body: new Uint8Array(fileBuffer),
                ContentType: file.type
            }
            await s3Client.send(new PutObjectCommand(params))
            return `https://mt1607-bucket.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${uniqueFileName}`
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

const s3Slice = createSlice({
    name: "s3",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(uploadAvatar.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(uploadAvatar.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
        });
        builder.addCase(uploadAvatar.fulfilled, (state, action) => {
            state.loading = false;
            state.avatarUrl = action.payload;
            state.success = true;
        });
    }
})

export default s3Slice.reducer;