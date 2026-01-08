/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'ignoreDuringBuilds' inside 'eslint' and 'ignoreBuildErrors' inside 'typescript'
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;