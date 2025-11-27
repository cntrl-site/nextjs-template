import type { GetServerSideProps, NextPage } from 'next';
import { CntrlClient, Page, PageProps, cntrlSdkContext } from '@cntrl-site/sdk-nextjs';
const buildMode = process.env.CNTRL_BUILD_MODE!;

type ParamsWithSlug = {
  slug: string;
};

const CntrlPage: NextPage<PageProps> = (props) => {
  cntrlSdkContext.init(props);
  return (
    <Page {...props} />
  );
}

export const getServerSideProps: GetServerSideProps<PageProps, ParamsWithSlug> = async ({ params }) => {
  const client = new CntrlClient(process.env.CNTRL_API_URL!);
  const originalSlug = params?.slug;
  const slug = Array.isArray(originalSlug) ? originalSlug.join('/') : '';
  const cntrlPageData = await client.getPageData(slug, buildMode === 'self-hosted' ? 'self-hosted' : 'default');
  const sectionData = await cntrlSdkContext.resolveSectionData(cntrlPageData.article.sections);

  return {
    props: {
      ...cntrlPageData,
      sectionData
    }
  };
};

export default CntrlPage;
