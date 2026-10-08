import { CntrlClient, PageProps, cntrlSdkContext } from '@cntrl-site/sdk-nextjs';

// Shared by both page files: pages/[[...slug]].page.tsx (static export) and
// pages/[[...slug]].ssr.tsx (staging, rendered per request). Which one is the
// route is decided by `pageExtensions` in next.config.js.

const buildMode = process.env.CNTRL_BUILD_MODE!;

// Constructed lazily: the client throws without CNTRL_API_URL, which a staging
// image does not have until it is started for a project.
let client: CntrlClient | undefined;
export const getClient = (): CntrlClient => {
  if (!client) {
    client = new CntrlClient(process.env.CNTRL_API_URL!);
  }
  return client;
};

export const slugFromParams = (slug: string | string[] | undefined): string =>
  Array.isArray(slug) ? slug.join('/') : '';

// The SDK signals a missing slug with a plain Error; its message is the only handle.
const isUnknownPageError = (e: unknown): boolean =>
  e instanceof Error && /was not found in project/.test(e.message);

// Everything a page needs to render, or null when the project has no page at
// that slug.
export async function loadPageProps(slug: string): Promise<PageProps | null> {
  const client = getClient();
  const publicApiBase = client.getHostname();
  cntrlSdkContext.setPublicApiBase(publicApiBase);
  let cntrlPageData;
  try {
    cntrlPageData = await client.getPageData(slug, buildMode === 'self-hosted' ? 'self-hosted' : 'default');
  } catch (e) {
    if (isUnknownPageError(e)) return null;
    throw e;
  }
  const sectionData = await cntrlSdkContext.resolveSectionData(cntrlPageData.article.sections);
  return {
    ...cntrlPageData,
    sectionData,
    publicApiBase,
    ...(process.env.SITE_URL ? { siteUrl: process.env.SITE_URL } : {})
  };
}
