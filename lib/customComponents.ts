import fs from 'fs';
import path from 'path';

const COMPONENTS_DIR = path.resolve(process.cwd(), '.cntrl-components');
const MANIFEST_PATH = path.join(COMPONENTS_DIR, 'manifest.json');

type Manifest = Record<string, { name: string; schema: Record<string, unknown> }>;

export interface CustomComponentsData {
  bundles: Record<string, string>;
  schemas: Record<string, Record<string, unknown>>;
}

let cached: CustomComponentsData | null = null;

export function loadCustomComponentsData(): CustomComponentsData {
  if (cached) return cached;

  if (!fs.existsSync(MANIFEST_PATH)) {
    cached = { bundles: {}, schemas: {} };
    return cached;
  }

  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const componentIds = Object.keys(manifest);

  if (componentIds.length === 0) {
    cached = { bundles: {}, schemas: {} };
    return cached;
  }

  const bundles: Record<string, string> = {};
  const schemas: Record<string, Record<string, unknown>> = {};

  for (const id of componentIds) {
    const bundlePath = path.join(COMPONENTS_DIR, `${id}.mjs`);
    if (fs.existsSync(bundlePath)) {
      bundles[id] = fs.readFileSync(bundlePath, 'utf-8');
      schemas[id] = manifest[id].schema;
    }
  }

  cached = { bundles, schemas };
  return cached;
}
