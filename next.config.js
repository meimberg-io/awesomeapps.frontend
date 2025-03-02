/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // 🚀 Verhindert ESLint-Fehler im Build
    },
};

export default nextConfig;