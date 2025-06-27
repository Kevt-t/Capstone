/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'items-images-sandbox.s3.us-west-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'items-images.s3.us-west-2.amazonaws.com',
        pathname: '/**',
      }
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
