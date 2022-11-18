import type { GetStaticProps, NextPage } from 'next';
import { CntrlClient, TArticle, TProject, TPage } from '@cntrl-site/sdk-nextjs';
import { Page } from '@cntrl-site/sdk-nextjs';

const client = new CntrlClient(
  process.env.CNTRL_PROJECT_ID!,
  process.env.CNTRL_API_URL!
);

interface Props {
  article: TArticle;
  project: TProject;
  page: TPage;
}

const CntrlPage: NextPage<Props> = (props) => {
  const meta = CntrlClient.getPageMeta(props.project.meta, props.page.meta!);
  return (
    <Page
      project={props.project}
      article={props.article}
      meta={meta}
    />
  );
}

type ParamsWithSlug = {
  slug: string;
};

export const getStaticProps: GetStaticProps<any, ParamsWithSlug> = async ({ params }) => {
  const originalSlug = params?.slug;
  const slug = Array.isArray(originalSlug)
    ? originalSlug.join('/')
    : '';
  const project = await client.getProject();
  const article = await client.getPageArticle(slug);
  const page = project.pages.find(page => page.slug === slug);

  return {
    props: {
      project,
      article,
      page
    }
  }
};

export async function getStaticPaths() {
  const res = await client.getProject();
  const routes = res.pages
    .map(page => ({
      params: {
        slug: [page.slug]
      }
    }));
  console.log(JSON.stringify(routes));
  const paths = routes;
  return { paths, fallback: false };
}

export default CntrlPage;
