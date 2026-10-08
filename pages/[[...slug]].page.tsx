import type { GetStaticProps } from 'next';
import { PageProps } from '@cntrl-site/sdk-nextjs';
import { CntrlPage } from '../components/CntrlPage';
import { getClient, loadPageProps, slugFromParams } from '../lib/pageData';

// The static-export page: every path enumerated and rendered at build time.
// Published sites and code export use this file. The staging image uses
// [[...slug]].ssr.tsx instead (see pageExtensions in next.config.js).

type ParamsWithSlug = {
  slug: string;
};

export const getStaticProps: GetStaticProps<PageProps, ParamsWithSlug> = async ({ params }) => {
  const props = await loadPageProps(slugFromParams(params?.slug));
  if (!props) return { notFound: true };
  return { props };
};

export async function getStaticPaths() {
  const pagePaths = await getClient().getProjectPagesPaths();
  const paths = pagePaths.map(path => ({
    params: {
      slug: path.split('/')
    }
  }));
  return { paths, fallback: false as const };
}

export default CntrlPage;
