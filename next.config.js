/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during the build process
  eslint: {
    // Only run ESLint during local development, not during build
    ignoreDuringBuilds: true,
  },
  // Additional configuration options
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig; 