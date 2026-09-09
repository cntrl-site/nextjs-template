import type { GetStaticProps, NextPage } from 'next';
import { CntrlClient, Page, PageProps, cntrlSdkContext } from '@cntrl-site/sdk-nextjs';

const buildMode = process.env.CNTRL_BUILD_MODE!;
// Staging serves pages on demand (ISR) from an image built without a project:
// no paths are enumerated at build time and every render revalidates.
const isStaging = buildMode === 'staging';
const STAGING_REVALIDATE_SECONDS = 1;

// Constructed lazily: the client throws without CNTRL_API_URL, which a staging
// image does not have until it is started for a project.
let client: CntrlClient | undefined;
const getClient = (): CntrlClient => {
  if (!client) {
    client = new CntrlClient(process.env.CNTRL_API_URL!);
  }
  return client;
};

type ParamsWithSlug = {
  slug: string;
};

const CntrlPage: NextPage<PageProps> = (props) => {
  cntrlSdkContext.init(props);
  return (
    <Page {...props} />
  );
}

export const getStaticProps: GetStaticProps<PageProps, ParamsWithSlug> = async ({ params }) => {
  const client = getClient();
  const originalSlug = params?.slug;
  const slug = Array.isArray(originalSlug) ? originalSlug.join('/') : '';
  const publicApiBase = client.getHostname();
  cntrlSdkContext.setPublicApiBase(publicApiBase);
  let cntrlPageData;
  try {
    cntrlPageData = await client.getPageData(slug, buildMode === 'self-hosted' ? 'self-hosted' : 'default');
  } catch (e) {
    // Unknown slug on the on-demand path: a 404, as the exported site would
    // give, not a 500. Revalidated so a page created later is picked up.
    if (isStaging && isUnknownPageError(e)) {
      return { notFound: true, revalidate: STAGING_REVALIDATE_SECONDS };
    }
    throw e;
  }
  const sectionData = await cntrlSdkContext.resolveSectionData(cntrlPageData.article.sections);

  return {
    props: {
      ...cntrlPageData,
      sectionData,
      publicApiBase,
      ...(process.env.SITE_URL ? { siteUrl: process.env.SITE_URL } : {})
    },
    ...(isStaging ? { revalidate: STAGING_REVALIDATE_SECONDS } : {})
  };
};

// The SDK signals a missing slug with a plain Error; its message is the only handle.
const isUnknownPageError = (e: unknown): boolean =>
  e instanceof Error && /was not found in project/.test(e.message);

export async function getStaticPaths() {
  if (isStaging) {
    return { paths: [], fallback: 'blocking' as const };
  }
  const pagePaths = await getClient().getProjectPagesPaths();
  const paths = pagePaths.map(path => ({
    params: {
      slug: path.split('/')
    }
  }));
  return { paths, fallback: false as const };
}

export default CntrlPage;
