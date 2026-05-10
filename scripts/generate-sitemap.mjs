#!/usr/bin/env node
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const publicDir = resolve(projectRoot, 'public');

loadDotenv(resolve(projectRoot, '.env.local'));

const apiUrl = process.env.CNTRL_API_URL;
const siteUrlOverride = process.env.SITE_URL;

if (!apiUrl) {
  console.warn('[sitemap] CNTRL_API_URL is not set — skipping sitemap/robots generation.');
  process.exit(0);
}

try {
  const project = await fetchProject(apiUrl);
  const siteUrl = resolveSiteUrl(project, siteUrlOverride);
  if (!siteUrl) {
    console.warn(
      '[sitemap] Could not resolve a canonical site URL — skipping sitemap/robots generation.\n' +
      '          The project has no primary domain in the API response and SITE_URL is not set.\n' +
      '          Either publish the site (so a primary domain exists) or set SITE_URL in .env.local.'
    );
    process.exit(0);
  }

  const pages = Array.isArray(project?.pages) ? project.pages : [];
  const indexable = pages.filter(isIndexablePage);
  const lastmod = new Date().toISOString();

  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  const sitemapXml = renderSitemap(indexable, siteUrl, lastmod);
  writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemapXml);
  console.log(`[sitemap] Wrote public/sitemap.xml for ${siteUrl} (${indexable.length} of ${pages.length} pages)`);

  const robotsTxt = renderRobots(siteUrl);
  writeFileSync(resolve(publicDir, 'robots.txt'), robotsTxt);
  console.log('[sitemap] Wrote public/robots.txt');
} catch (err) {
  console.warn(`[sitemap] Failed to generate sitemap/robots: ${err?.message || err}`);
  console.warn('[sitemap] Continuing build without updated sitemap.');
  process.exit(0);
}

async function fetchProject(rawApiUrl) {
  const url = new URL(rawApiUrl);
  const projectId = url.username;
  const apiKey = url.password;
  if (!projectId || !apiKey) {
    throw new Error('CNTRL_API_URL must include project id and API key (https://<id>:<key>@api.cntrl.site).');
  }
  const endpoint = new URL(`/projects/${projectId}?buildMode=default`, url.origin);
  const response = await fetch(endpoint.href, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  if (!response.ok) {
    throw new Error(`Project fetch failed (${response.status} ${response.statusText}).`);
  }
  return response.json();
}

function resolveSiteUrl(project, override) {
  if (override) return stripTrailingSlash(ensureProtocol(override));
  if (project?.primaryDomain) return stripTrailingSlash(ensureProtocol(project.primaryDomain));
  return null;
}

function ensureProtocol(value) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function isIndexablePage(page) {
  if (!page || typeof page.slug !== 'string') return false;
  if (page.isPublished === false) return false;
  if (page.auth && page.auth.enabled === true) return false;
  return true;
}

function renderSitemap(pages, siteUrl, lastmod) {
  const entries = pages.map(page => {
    const path = page.slug ? `/${page.slug}` : '/';
    const loc = escapeXml(`${siteUrl}${path}`);
    const priority = page.slug === '' ? '1.00' : '0.80';
    const updated = page.updatedAt ? new Date(page.updatedAt).toISOString() : lastmod;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${updated}</lastmod>`,
      `    <priority>${priority}</priority>`,
      '  </url>'
    ].join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    ''
  ].join('\n');
}

function renderRobots(siteUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    ''
  ].join('\n');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function loadDotenv(envPath) {
  if (!existsSync(envPath)) return;
  const contents = readFileSync(envPath, 'utf8');
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
