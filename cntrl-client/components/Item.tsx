import { ComponentType, FC } from 'react';
import { ArticleItemType, Item, Layout } from '../Format';
import RectangleItem from './RectangleItem';
import { createUseStyles } from 'react-jss';
import { getLayoutStyles } from '../utils';

interface ItemProps {
  layouts: Layout[];
  item: Item;
}

interface StyleParams {
  area: Item['area'];
  layouts: Layout[];
}

const itemsMap: Record<ArticleItemType, ComponentType<ItemProps>> = {
  // @ts-ignore
  [ArticleItemType.Rectangle]: RectangleItem
};

const useStyles = createUseStyles({
  item: ({ area, layouts }: StyleParams) => ({
    position: 'absolute',
    ...getLayoutStyles(layouts, area, (area) => ({
      top: `${area.top * 100}vw`,
      left: `${area.left * 100}vw`,
      width: `${area.width * 100}vw`,
      height: `${area.height * 100}vw`,
      zIndex: area.zIndex
    }))
  })
});

const noop = () => null;

const Item: FC<ItemProps> = ({ item, layouts }) => {
  const styles = useStyles({ area: item.area, layouts });
  const ItemComponent = itemsMap[item.type] || noop;
  return (
    <div className={styles.item}>
      <ItemComponent item={item} layouts={layouts} />
    </div>
  );
};

export default Item;
