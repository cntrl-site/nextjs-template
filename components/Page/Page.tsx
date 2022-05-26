import React, { FC } from 'react';
import Head from 'next/head';
import { Article as TArticle, Project } from '../../cntrl-client/Format';
import Article from '../../cntrl-client/components/Article';

interface Props {
  article: TArticle;
  project: Project;
}

const Page: FC<Props> = ({ article, project }) => {
  return (
    <>
      <Head>
        <title>{project.meta?.title}</title>
        <meta name="description" content={project.meta?.description} />
        <link rel="icon" href={project.meta?.favicon} />
      </Head>
      <Article article={article} layouts={project.layouts} />
    </>
  );
};

export default Page;
