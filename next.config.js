const isCodeExport = process.env.CNTRL_BUILD_MODE === 'code-export';
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  output: 'export',
  distDir: '_static',
  assetPrefix: isCodeExport ? './' : undefined
};

module.exports = nextConfig;
