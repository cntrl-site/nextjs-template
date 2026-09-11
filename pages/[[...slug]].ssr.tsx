import type { GetServerSideProps } from 'next';
import { PageProps } from '@cntrl-site/sdk-nextjs';
import { CntrlPage } from '../components/CntrlPage';
import { loadPageProps, slugFromParams } from '../lib/pageData';

// The staging page: rendered on every request from whatever the project's API
// returns right now, so an edit in the editor shows on the next reload. Only a
// page in a CNTRL_BUILD_MODE=staging build (see pageExtensions in
// next.config.js); a page may not export both getStaticProps and
// getServerSideProps, hence two files sharing lib/pageData.

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ params }) => {
  const props = await loadPageProps(slugFromParams(params?.slug));
  if (!props) return { notFound: true };
  return { props };
};

export default CntrlPage;
