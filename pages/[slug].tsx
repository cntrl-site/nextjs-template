import type { GetStaticProps, NextPage } from 'next'
import { CntrlClient } from '../cntrl-client/CntrlClient';
import { Article as TArticle, Project, TPage } from '../cntrl-client/Format';
import Page from '../components/Page/Page';

const client = new CntrlClient(process.env.CNTRL_PROJECT_ID!);

interface Props {
  article: TArticle;
  project: Project;
  page: TPage;
}

const CntrlPage: NextPage<Props> = (props) => {
  const meta = CntrlClient.getPageMeta(props.project.meta, props.page.meta);
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
  if (params?.slug === undefined) {
    throw new Error('Slug is not defined');
  }
  const slug = params.slug === 'index' ? '' : params.slug;
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

  const paths = res.pages.map((page) => ({
    params: {
      slug: page.slug === '' ? 'index' : page.slug
    }
  }));

  return { paths, fallback: false };
}

export default CntrlPage;
