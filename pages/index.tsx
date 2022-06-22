import type { GetStaticProps, NextPage } from 'next'
import { CntrlClient } from '../cntrl-client/CntrlClient';
import { Article as TArticle, Project, TPage } from '../cntrl-client/Format';
import Page from '../components/Page/Page';
import { Redirect } from '../components/Redirect';

const client = new CntrlClient(process.env.CNTRL_PROJECT_ID!);

interface Props {
  article: TArticle;
  project: Project;
  page: TPage;
}

const Index: NextPage<Props> = (props) => {
  const meta = CntrlClient.getPageMeta(props.project.meta, props.page.meta);

  if (!props.page) {
    return <Redirect />;
  }

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
  const article = await client.getPageArticle('');
  const page = project.pages.find(page => page.slug === '');

  return {
    props: {
      project,
      article,
      page
    }
  }
};

export default Index;
