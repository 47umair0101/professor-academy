import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@professor-academy/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
