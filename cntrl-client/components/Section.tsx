import { FC, ReactElement } from 'react';
import { Layout, Section as TSection } from '../Format';
import { getLayoutStyles } from '../utils';

type SectionChild = ReactElement<any, any>;

interface Props {
  section: TSection;
  layouts: Layout[];
  children: SectionChild[];
}

const Section: FC<Props> = ({ section, layouts, children }) => {
  return (
    <>
      <div className={`section-${section.id}`}>
        {children}
      </div>
      <style jsx>{`
        ${
        getLayoutStyles(layouts, [section.height], ([height]) => (`
           .section-${section.id} {
              height: ${height * 100}vw;
            }`
        ))
      }
      `}</style>
    </>
  );
};

export default Section;
