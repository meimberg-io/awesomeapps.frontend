/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Linting runs during build - errors will fail the build
    // This ensures local builds match CI/CD requirements
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'graph.microsoft.com',
            },
        ],
    },
};

export default nextConfig;