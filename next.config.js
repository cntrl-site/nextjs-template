/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  basePath
};

module.exports = nextConfig;
