import type { GetStaticProps, NextPage } from 'next'
import { CntrlClient } from '../cntrl-client/CntrlClient';
import { Article } from '../cntrl-client/Format';

const client = new CntrlClient(process.env.CNTRL_PROJECT_ID!);

interface Props {
  article: Article;
}

const Article: NextPage<Props> = (props) => {
  return (
    <div>{props.article.sections[0].items.map(item => item.id).join(', ')}</div>
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

export default Article
