import type { GetStaticProps, NextPage } from 'next';
import { CntrlClient, Page, PageProps, cntrlSdkContext, TTypePresets } from '@cntrl-site/sdk-nextjs';

const client = new CntrlClient(process.env.CNTRL_API_URL!);

interface Props extends PageProps {
  typePresets: TTypePresets;
}

type ParamsWithSlug = {
  slug: string;
};

const CntrlPage: NextPage<Props> = (props) => {
  cntrlSdkContext.setLayouts(props.project.layouts);
  cntrlSdkContext.setTypePresets(props.typePresets);
  return (
    <Page {...props} />
  );
}

export const getStaticProps: GetStaticProps<Props, ParamsWithSlug> = async ({ params }) => {
  const originalSlug = params?.slug;
  const slug = Array.isArray(originalSlug) ? originalSlug.join('/') : '';
  const props = await client.getPageData(slug);

  return { props };
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
