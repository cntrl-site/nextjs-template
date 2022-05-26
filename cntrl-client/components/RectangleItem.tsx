import { FC } from 'react';
import { Layout, RectangleItem } from '../Format';
import { createUseStyles } from 'react-jss';
import { getLayoutStyles } from '../utils';

interface Props {
  item: RectangleItem;
  layouts: Layout[];
}

interface StylesParams {
  layouts: Layout[];
  layoutParams: RectangleItem['layoutParams'];
}

const useStyles = createUseStyles({
  rectangleItem: ({ layouts, layoutParams }: StylesParams) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    ...getLayoutStyles(layouts, layoutParams, ({ fillColor }) => ({
      backgroundColor: fillColor
    }))
  })
});

const RectangleItem: FC<Props> = ({ item, layouts }) => {
  const styles = useStyles({ layouts, layoutParams: item.layoutParams });

  return (
    <div className={styles.rectangleItem}></div>
  );
};

export default RectangleItem;
