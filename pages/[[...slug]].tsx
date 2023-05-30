import type { GetStaticProps, NextPage } from 'next';
import { CntrlClient, TArticle, TProject, TPage } from '@cntrl-site/sdk-nextjs';
import { Page, cntrlSdkContext } from '@cntrl-site/sdk-nextjs';
import { TKeyframeAny, TTypePresets } from '@cntrl-site/core';

const client = new CntrlClient(process.env.CNTRL_API_URL!);

interface Props {
  article: TArticle;
  project: TProject;
  typePresets: TTypePresets;
  page: TPage;
  keyframes: TKeyframeAny[];
}

const CntrlPage: NextPage<Props> = (props) => {
  const meta = CntrlClient.getPageMeta(props.project.meta, props.page.meta!);
  cntrlSdkContext.setLayouts(props.project.layouts);
  cntrlSdkContext.setTypePresets(props.typePresets);

  return (
    <Page
      project={props.project}
      article={props.article}
      meta={meta}
      keyframes={props.keyframes}
    />
  );
}

type ParamsWithSlug = {
  slug: string;
};

export const getStaticProps: GetStaticProps<Props, ParamsWithSlug> = async ({ params }) => {
  const originalSlug = params?.slug;
  const slug = Array.isArray(originalSlug)
    ? originalSlug.join('/')
    : '';
  const project = await client.getProject();
  const { article, keyframes } = await client.getPageArticle(slug);
  const typePresets = await client.getTypePresets();
  const page = project.pages.find(page => page.slug === slug)!;

  return {
    props: {
      project,
      article,
      page,
      typePresets,
      keyframes
    }
  }
};

export async function getStaticPaths() {
  const res = await client.getProject();
  const paths = res.pages
    .map(page => ({
      params: {
        slug: [page.slug]
      }
    }));
  return { paths, fallback: false };
}

export default CntrlPage;
