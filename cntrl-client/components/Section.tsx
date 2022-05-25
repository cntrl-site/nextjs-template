import { FC, ReactElement } from 'react';
import { createUseStyles } from 'react-jss';
import { Layout, Section as TSection } from '../Format';
import { getLayoutStyles } from '../utils';

type SectionChild = ReactElement<any, any>;

interface Props {
  section: TSection;
  layouts: Layout[];
  children: SectionChild[];
}

interface StyleParams {
  layouts: Layout[];
  height: TSection['height'];
}

const useStyles = createUseStyles({
  section: ({ height, layouts }: StyleParams) => ({
    position: 'relative',
    ...getLayoutStyles(layouts, height, (height) => ({
      height: `${height * 100}vw`
    }))
  })
});

const Section: FC<Props> = ({ section, layouts, children }) => {
  const styles = useStyles({ height: section.height, layouts });
  return (
    <div className={styles.section}>
      {children}
    </div>
  );
};

export default Section;
