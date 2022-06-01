import { FC } from 'react';
import { Layout, RectangleItem } from '../Format';
import { createUseStyles } from 'react-jss';
import { getLayoutStyles } from '../utils';
import { ItemProps } from './Item';

interface StylesParams {
  layouts: Layout[];
  layoutParams: RectangleItem['layoutParams'];
}

const useStyles = createUseStyles({
  rectangleItem: ({ layouts, layoutParams }: StylesParams) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderStyle: 'solid',
    boxSizing: 'border-box',
    ...getLayoutStyles(layouts, [layoutParams],
      ([{ opacity, strokeColor, fillColor, radius, strokeWidth }]) => ({
        opacity: opacity,
        borderColor: strokeColor,
        backgroundColor: fillColor,
        borderRadius: `${radius * 100}vw`,
        borderWidth: `${strokeWidth * 100}vw`
    }))
  })
});

const RectangleItem: FC<ItemProps<RectangleItem>> = ({ item, layouts }) => {
  const styles = useStyles({ layouts, layoutParams: item.layoutParams });
  return (
    <div className={styles.rectangleItem} />
  );
};

export default RectangleItem;
