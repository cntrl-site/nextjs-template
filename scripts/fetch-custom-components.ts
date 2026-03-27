import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve(process.cwd(), '.cntrl-components');

async function resolveCntrlClient(): Promise<{ CntrlClient: any }> {
  const localSdkPath = process.env.LOCAL_SDK_REL_PATH;
  if (localSdkPath) {
    return import(path.resolve(localSdkPath, 'src/index.ts'));
  }
  return import('@cntrl-site/sdk-nextjs');
}

async function main() {
  const apiUrl = process.env.CNTRL_API_URL;
  if (!apiUrl) {
    console.log('[cntrl] CNTRL_API_URL not set, skipping custom component fetch.');
    return;
  }

  const { CntrlClient } = await resolveCntrlClient();
  const client = new CntrlClient(apiUrl);
  const buildMode = process.env.CNTRL_BUILD_MODE === 'self-hosted' ? 'self-hosted' : 'default';

  console.log('[cntrl] Fetching custom components...');
  const components = await client.fetchCustomComponents(buildMode);

  if (components.length === 0) {
    console.log('[cntrl] No custom components found.');
    writeManifest({});
    return;
  }

  console.log(`[cntrl] Found ${components.length} custom component(s). Downloading bundles...`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const manifest: Record<string, { name: string; schema: Record<string, unknown> }> = {};
  for (const component of components) {
    try {
      const bundle = await client.fetchCustomComponentBundle(component.id, buildMode);
      const bundlePath = path.join(OUTPUT_DIR, `${component.id}.mjs`);
      fs.writeFileSync(bundlePath, bundle, 'utf-8');
      manifest[component.id] = {
        name: component.name,
        schema: component.schema
      };
      console.log(`[cntrl]   ✓ ${component.name} (${component.id})`);
    } catch (err) {
      console.error(`[cntrl]   ✗ Failed to fetch bundle for ${component.name} (${component.id}):`, err);
    }
  }

  writeManifest(manifest);
  console.log(`[cntrl] Done. ${Object.keys(manifest).length} bundle(s) saved to .cntrl-components/`);
}

function writeManifest(manifest: Record<string, { name: string; schema: Record<string, unknown> }>) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
}

main().catch((err) => {
  console.error('[cntrl] Failed to fetch custom components:', err);
  process.exit(1);
});
