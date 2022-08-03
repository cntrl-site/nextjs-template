import type { GetStaticProps, NextPage } from 'next'
import { TArticle, TProject, TPage } from '@cntrl-site/core';
import { CntrlClient } from '@cntrl-site/sdk';
import { Page } from '@cntrl-site/sdk-nextjs';
import { Redirect } from '../components/Redirect';

const client = new CntrlClient(process.env.CNTRL_PROJECT_ID!, process.env.CNTRL_API_URL!);

interface Props {
  project: TProject;
  article?: TArticle;
  page?: TPage;
}

const Index: NextPage<Props> = (props) => {
  if (!props.page || !props.article) {
    return <Redirect />;
  }

  const meta = CntrlClient.getPageMeta(props.project.meta, props.page.meta!);

  return (
    <Page
      project={props.project}
      article={props.article}
      meta={meta}
    />
  );
}

export const getStaticProps: GetStaticProps<any, any> = async () => {
  const project = await client.getProject();
  const page = project.pages.find(page => page.slug === '') || null;
  const article = page ? await client.getPageArticle('') : null;

  return {
    props: {
      project,
      article,
      page
    }
  }
};

export default Index;
