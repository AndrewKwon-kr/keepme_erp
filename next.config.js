/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    loader: 'default',
    minimumCacheTTL: 60,
    remotePatterns: [
      // 임시 이미지 데이터용 js.devexpress.com
      {
        protocol: 'https',
        hostname: 'js.devexpress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.weather.go.kr',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.kogl.or.kr',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
