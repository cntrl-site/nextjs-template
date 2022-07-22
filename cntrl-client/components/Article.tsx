import { FC } from 'react';
import { Article as TArticle, Layout } from '../Format';
import Section from './Section';
import Item from './Item';

interface Props {
  article: TArticle;
  layouts: Layout[];
}

const Article: FC<Props> = ({ article, layouts }) => {
  return (
    <div className={'article'}>
      <style jsx>{`
        .article {
          position: relative;
          overflow-x: hidden;
        }
      `}</style>
      {article.sections.map((section, i) => (
        <Section section={section} key={section.id} layouts={layouts}>
          {article.sections[i].items.map(item => (
            <Item layouts={layouts} item={item} key={item.id} />
          ))}
        </Section>
      ))}
    </div>
  );
};

export default Article;
