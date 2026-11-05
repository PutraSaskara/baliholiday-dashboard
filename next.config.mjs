/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'api.saskaraputra.my.id' },
            { hostname: 'localhost' },
            { hostname: 'res.cloudinary.com' },
        ],
    },
};

export default nextConfig;
