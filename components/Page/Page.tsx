import React, { FC } from 'react';
import Head from 'next/head';
import { Article as TArticle, Meta, Project } from '../../cntrl-client/Format';
import Article from '../../cntrl-client/components/Article';
import HTMLReactParser from 'html-react-parser';

interface Props {
  article: TArticle;
  project: Project;
  meta: Meta;
}

const Page: FC<Props> = ({ article, project, meta }) => {
  const adobeFont = HTMLReactParser(project.fonts.adobe);
  const googleFont = HTMLReactParser(project.fonts.google);
  const scripts = HTMLReactParser(project.scripts);
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta property="og:url" content={meta.opengraphThumbnail} />
        <link rel="icon" href={meta.favicon} />
        {adobeFont}
        {googleFont}
        {scripts}
      </Head>
      <Article article={article} layouts={project.layouts} />
    </>
  );
};

export default Page;
