import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['kuroshiro', 'kuroshiro-analyzer-kuromoji'],
  async headers() {
    return [
      {
        source: '/dict/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
