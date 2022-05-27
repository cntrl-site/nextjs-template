import type { GetStaticProps, NextPage } from 'next'
import { CntrlClient } from '../cntrl-client/CntrlClient';
import { Article as TArticle, Project } from '../cntrl-client/Format';
import Page from '../components/Page/Page';


const client = new CntrlClient(process.env.CNTRL_PROJECT_ID!);

interface Props {
  article: TArticle;
  project: Project;
}

const CntrlPage: NextPage<Props> = (props) => <Page project={props.project} article={props.article} />;

type ParamsWithSlug = {
  slug: string;
};

export const getStaticProps: GetStaticProps<any, ParamsWithSlug> = async ({ params }) => {
  if (params?.slug === undefined) {
    throw new Error('Slug is not defined');
  }
  const project = await client.getProject();
  const article = await client.getPageArticle(params.slug);

  return {
    props: {
      project,
      article
    }
  }
};

export async function getStaticPaths() {
  const res = await client.getProject();

  const paths = res.pages.map((page) => ({
    params: {
      slug: page.slug
    }
  }));

  return { paths, fallback: false };
}

export default CntrlPage;
