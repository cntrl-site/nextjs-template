import type { GetStaticProps, NextPage } from 'next'
import { CntrlClient } from '../cntrl-client/CntrlClient';
import { Article as TArticle } from '../cntrl-client/Format';
import Article from '../cntrl-client/components/Article';


const client = new CntrlClient(process.env.CNTRL_PROJECT_ID!);

interface Props {
  article: TArticle;
}

const Page: NextPage<Props> = (props) => {
  return (
    <Article article={props.article} />
  );
};

type ParamsWithSlug = {
  slug: string;
};

export const getStaticProps: GetStaticProps<any, ParamsWithSlug> = async ({ params }) => {
  if (params?.slug === undefined) {
    throw new Error('Slug is not defined');
  }
  const res = await client.getPageArticle(params.slug);

  return {
    props: {
      article: res
    }
  }
};

export async function getStaticPaths() {
  const res = await client.getProject();

  const paths = res.pages.map((page) => ({
    params: { slug: page.slug },
  }));

  return { paths, fallback: false };
}

export default Page
