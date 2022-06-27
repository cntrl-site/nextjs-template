import React, { FC } from 'react';
import HTMLReactParser, { domToReact } from 'html-react-parser';
import Head from 'next/head';
import { Article as TArticle, Meta, Project } from '../../cntrl-client/Format';
import Article from '../../cntrl-client/components/Article';

interface Props {
  article: TArticle;
  project: Project;
  meta: Meta;
}

const Page: FC<Props> = ({ article, project, meta }) => {
  const googleFonts: ReturnType<typeof domToReact> = HTMLReactParser(project.fonts.google);
  const adobeFonts: ReturnType<typeof domToReact> = HTMLReactParser(project.fonts.adobe);
  const parsedFonts = {
    ...(typeof googleFonts === 'object' ? googleFonts : {}),
    ...(typeof adobeFonts === 'object' ? adobeFonts : {})
  };
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
        {project.fonts.adobe}
        {Object.values(parsedFonts as ReturnType<typeof domToReact>).map((value, i) => {
          if (!value) return undefined;
          const rel = value.props?.rel;
          const href = value.props?.href;
          if (!rel || !href) return undefined;
          return (
            <link key={i} rel={rel} href={href} />
          );
        })}
        {htmlHead}

      </Head>
      {afterBodyOpen}
      <Article article={article} layouts={project.layouts} />
      {beforeBodyClose}
    </>
  );
};

export default Page;
