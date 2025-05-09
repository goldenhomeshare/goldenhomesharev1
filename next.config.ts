import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve your existing remote image patterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },

  // Disable ESLint errors from blocking the production build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors from blocking the production build
  typescript: {
    ignoreBuildErrors: true,
  },

  // (Optional) If you want a purely static export:
  // output: "export",
};

export default nextConfig;
