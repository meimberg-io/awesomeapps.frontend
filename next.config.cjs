/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // 🚀 Verhindert, dass ESLint den Build blockiert
    },
};

module.exports = nextConfig;