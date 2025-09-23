const isCodeExport = process.env.CNTRL_BUILD_MODE === 'self-hosted';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  output: 'export',
  distDir: '_static',
  assetPrefix: isCodeExport ? './' : undefined,
};

module.exports = nextConfig;
