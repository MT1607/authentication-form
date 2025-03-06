import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',
    async redirects() {
        return [{
            source: "/",
            destination: "/dashboard",
            permanent: true,
        }]
    }
};

export default nextConfig;
