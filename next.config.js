/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true, // 🚀 Verhindert ESLint-Fehler im Build
    },
};

export default nextConfig;