/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', "www.fillmurray.com", "res.cloudinary.com", "avatars.githubusercontent.com", "lh3.googleusercontent.com"],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
