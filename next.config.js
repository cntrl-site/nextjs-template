const path = require('path');

const isCodeExport = process.env.CNTRL_BUILD_MODE === 'self-hosted';
// Staging renders pages per request instead of exporting a static site.
// Dropping `output: 'export'` is what makes that legal; which page file is the
// route is decided by `pageExtensions` below.
const isStaging = process.env.CNTRL_BUILD_MODE === 'staging';

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
  // One route, two page files: [[...slug]].page.tsx exports statically,
  // [[...slug]].ssr.tsx renders per request. A page may not export both
  // getStaticProps and getServerSideProps, so each build sees exactly one of
  // them. _app is `.shared.tsx` and belongs to both.
  pageExtensions: isStaging ? ['ssr.tsx', 'shared.tsx'] : ['page.tsx', 'shared.tsx'],
  // Staging images are built once and started per project, so the base path
  // arrives at runtime; `next start` re-reads this file and applies it.
  ...(isStaging
    ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH || '' }
    : { output: 'export' }),
  distDir: '_static',
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
