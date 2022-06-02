import React, { FC } from 'react';
import Head from 'next/head';
import { Article as TArticle, Project } from '../../cntrl-client/Format';
import Article from '../../cntrl-client/components/Article';
import HTMLReactParser from 'html-react-parser';

interface Props {
  article: TArticle;
  project: Project;
}

const Page: FC<Props> = ({ article, project }) => {
  const adobeFont = HTMLReactParser(project.fonts.adobe);
  const googleFont = HTMLReactParser(project.fonts.google);
  const scripts = HTMLReactParser(project.scripts);
  return (
    <>
      <Head>
        <title>{project.meta?.title}</title>
        <meta name="description" content={project.meta?.description} />
        <meta name="keywords" content={project.meta?.keywords} />
        <meta property="og:url" content={project.meta?.opengraphThumbnail} />
        <link rel="icon" href={project.meta?.favicon} />
        {adobeFont}
        {googleFont}
        {scripts}
      </Head>
      <Article article={article} layouts={project.layouts} />
    </>
  );
};

export default Page;
