import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Security headers (moved to middleware.ts)
  // Note: Security headers are now handled in middleware.ts
};

export default nextConfig;

