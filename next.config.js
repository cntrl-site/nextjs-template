const isCodeExport = process.env.CNTRL_BUILD_MODE === 'self-hosted';

const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  output: 'export',
  distDir: '_static',
  assetPrefix: isCodeExport ? './' : undefined,
  typescript: {
    ignoreBuildErrors: isCodeExport,
  }
};

module.exports = nextConfig;
