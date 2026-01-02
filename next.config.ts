import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix workspace root warning
  // This warning appears because Next.js detects multiple package-lock.json files
  // It's harmless but we can suppress it by setting outputFileTracingRoot
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
