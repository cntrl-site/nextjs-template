import React, { FC } from 'react';
import HTMLReactParser from 'html-react-parser';
import Head from 'next/head';
import { Article as TArticle, Meta, Project } from '../../cntrl-client/Format';
import Article from '../../cntrl-client/components/Article';

interface Props {
  article: TArticle;
  project: Project;
  meta: Meta;
}

const Page: FC<Props> = ({ article, project, meta }) => {
  const adobeFont = HTMLReactParser(project.fonts.adobe);
  const googleFont = HTMLReactParser(project.fonts.google);
  const htmlHead = HTMLReactParser(project.html.head);
  const afterBodyOpen = HTMLReactParser(project.html.afterBodyOpen);
  const beforeBodyClose = HTMLReactParser(project.html.beforeBodyClose);
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
        {htmlHead}

      </Head>
      {afterBodyOpen}
      <Article article={article} layouts={project.layouts} />
      {beforeBodyClose}
    </>
  );
};

export default Page;
