import { FC } from 'react';
import { Article as TArticle } from '../Format';
import { createUseStyles } from 'react-jss';

interface Props {
  article: TArticle;
}

const useStyles = createUseStyles({
  someDiv: {
    color: 'red'
  }
})

const Article: FC<Props> = ({ article }) => {
  const styles = useStyles();
  return (
    <div className={styles.someDiv}>
      {article.sections[0].items.map(item => item.id).join(', ')}
    </div>
  );
};

export default Article;