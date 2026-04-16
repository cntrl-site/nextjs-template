const path = require('path');

const isCodeExport = process.env.CNTRL_BUILD_MODE === 'self-hosted';

const localSdkNextjsPath = process.env.LOCAL_SDK_NEXTJS_REL_PATH;
const localSdkPath = process.env.LOCAL_SDK_REL_PATH;
const localComponentsPath = process.env.LOCAL_COMPONENTS_REL_PATH;

const sdkNextjsDir = localSdkNextjsPath ? path.resolve(__dirname, localSdkNextjsPath) : null;
const sdkDir = localSdkPath ? path.resolve(__dirname, localSdkPath) : null;
const componentsDir = localComponentsPath ? path.resolve(__dirname, localComponentsPath) : null;

const localPackages = [
  ...(sdkNextjsDir ? ['@cntrl-site/sdk-nextjs'] : []),
  ...(sdkDir ? ['@cntrl-site/sdk'] : []),
  ...(componentsDir ? ['@cntrl-site/components'] : []),
];

const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  // output: 'export',
  assetPrefix: isCodeExport ? './' : undefined,
  ...(localPackages.length > 0 ? { transpilePackages: localPackages } : {}),
  webpack: (config) => {
    const hasLocalPackages = sdkNextjsDir || sdkDir || componentsDir;
    if (hasLocalPackages) {
      config.resolve.alias['react'] = path.resolve(__dirname, 'node_modules/react');
      config.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules/react-dom');
      config.resolve.alias['styled-jsx'] = path.resolve(__dirname, 'node_modules/styled-jsx');
    }
    if (sdkNextjsDir) {
      config.resolve.alias['@cntrl-site/sdk-nextjs'] = path.resolve(sdkNextjsDir, 'src/index.ts');
    }
    if (sdkDir) {
      config.resolve.alias['@cntrl-site/sdk/lib'] = path.resolve(sdkDir, 'src');
      config.resolve.alias['@cntrl-site/sdk'] = path.resolve(sdkDir, 'src/index.ts');
    }
    if (componentsDir) {
      config.resolve.alias['@cntrl-site/components/style/components.css'] = path.resolve(componentsDir, 'dist/components.css');
      config.resolve.alias['@cntrl-site/components/utils'] = path.resolve(componentsDir, 'dist/utils.mjs');
      config.resolve.alias['@cntrl-site/components'] = path.resolve(componentsDir, 'dist/index.mjs');
    }
    return config;
  },
};

module.exports = nextConfig;
