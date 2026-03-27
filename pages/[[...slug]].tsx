import type { GetStaticProps, NextPage } from 'next';
import { CntrlClient, Page, PageProps, cntrlSdkContext, resolveCustomComponents } from '@cntrl-site/sdk-nextjs';
import { loadCustomComponentsData } from '../lib/customComponents';

const client = new CntrlClient(process.env.CNTRL_API_URL!);
const buildMode = process.env.CNTRL_BUILD_MODE!;

type ParamsWithSlug = {
  slug: string;
};

const CntrlPage: NextPage<PageProps> = (props) => {
  const { customComponentBundles, ...pageProps } = props;
  if (customComponentBundles && Object.keys(customComponentBundles.bundles).length > 0) {
    const customComponents = resolveCustomComponents(
      customComponentBundles.bundles,
      customComponentBundles.schemas
    );
    cntrlSdkContext.init({ ...pageProps, customComponents });
  } else {
    cntrlSdkContext.init(pageProps);
  }
  return (
    <Page {...props} />
  );
}

export const getStaticProps: GetStaticProps<PageProps, ParamsWithSlug> = async ({ params }) => {
  const originalSlug = params?.slug;
  const slug = Array.isArray(originalSlug) ? originalSlug.join('/') : '';
  const cntrlPageData = await client.getPageData(slug, buildMode === 'self-hosted' ? 'self-hosted' : 'default');
  const sectionData = await cntrlSdkContext.resolveSectionData(cntrlPageData.article.sections);
  const customComponentBundles = loadCustomComponentsData();

  return {
    props: {
      ...cntrlPageData,
      sectionData,
      customComponentBundles
    }
  };
};

export async function getStaticPaths() {
  const pagePaths = await client.getProjectPagesPaths();
  const paths = pagePaths.map(path => ({
    params: {
      slug: path.split('/')
    }
  }));
  return { paths, fallback: false };
}

export default CntrlPage;
