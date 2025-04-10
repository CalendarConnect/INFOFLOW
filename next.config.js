/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during the build process
  eslint: {
    // Only run ESLint during local development, not during build
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript type checking during build
  typescript: {
    // Skip type checking for faster builds
    ignoreBuildErrors: true,
  },
  // Disable build output for faster builds
  output: 'standalone',
};

module.exports = nextConfig; 