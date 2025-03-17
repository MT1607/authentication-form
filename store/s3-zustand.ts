import {create} from "zustand/react";
import s3Client from "@/lib/s3Config";
import {PutObjectCommand} from "@aws-sdk/client-s3";

interface S3State {
    error: string | null,
    loading: boolean,
    avatarUrl: string | null,
    uploadAvatar: (file: File) => Promise<void>
}

export const useS3Store = create<S3State>((set, get) => ({
    error: null,
    loading: false,
    avatarUrl: null,

    uploadAvatar: async (file) => {
        set({loading: true});
        try {
            const [fileName] = file.name.split(".");
            const uniqueFileName = `avatar-${Date.now()}-${fileName}`;
            const fileBuffer = await file.arrayBuffer();

            const params = {
                Bucket: "mt1607-bucket",
                Key: uniqueFileName,
                Body: new Uint8Array(fileBuffer),
                ContentType: file.type,
            };

            await s3Client.send(new PutObjectCommand(params));

            const fileUrl = `https://mt1607-bucket.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${uniqueFileName}`;
            set({loading: false, avatarUrl: fileUrl});
        } catch (e) {
            console.log("e", e);
            set({error: "Upload failed", loading: false})
        }
    }
}))