import type { GetStaticProps, NextPage } from 'next';
import { CntrlClient, Page, PageProps, cntrlSdkContext, TTypePresets, TArticleSection } from '@cntrl-site/sdk-nextjs';

const client = new CntrlClient(process.env.CNTRL_API_URL!);

interface Props extends PageProps {
  typePresets: TTypePresets;
  sectionData: Record<string, any>;
}

type ParamsWithSlug = {
  slug: string;
};

const CntrlPage: NextPage<Props> = (props) => {
  cntrlSdkContext.init(props);
  return (
    <Page {...props} />
  );
}

export const getStaticProps: GetStaticProps<Props, ParamsWithSlug> = async ({ params }) => {
  const originalSlug = params?.slug;
  const slug = Array.isArray(originalSlug) ? originalSlug.join('/') : '';
  const cntrlPageData = await client.getPageData(slug);
  const sectionData = await cntrlSdkContext.resolveSectionData(cntrlPageData.article.sections);

  return {
    props: {
      ...cntrlPageData,
      sectionData
    }
  };
};

export async function getStaticPaths() {
  const pagePaths = await client.getProjectPagesPaths();
  const paths = pagePaths.map(path => ({
    params: {
      slug: [path]
    }
  }));
  return { paths, fallback: false };
}

export default CntrlPage;
