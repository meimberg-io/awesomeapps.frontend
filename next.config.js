/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Linting runs during build - errors will fail the build
    // This ensures local builds match CI/CD requirements
};

export default nextConfig;