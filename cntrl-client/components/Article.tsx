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
    <>
      {article.sections.map((section, i) => (
        <Section section={section} key={section.id} layouts={layouts}>
          {article.sections[i].items.map(item => (
            // eslint-disable-next-line react/jsx-key
            <Item layouts={layouts} item={item} />
          ))}
        </Section>
      ))}
    </>
  );
};

export default Article;