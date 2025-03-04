import {S3Client} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION || '',
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY || '',
        secretAccessKey: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_LIMIT || ''
    },
});

export default s3Client;