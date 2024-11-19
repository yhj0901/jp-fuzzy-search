import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // 정적 파일 처리를 위한 설정
  async headers() {
    return [
      {
        source: '/dict/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'application/octet-stream',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
