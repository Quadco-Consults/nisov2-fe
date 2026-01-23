import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript errors are skipped during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
