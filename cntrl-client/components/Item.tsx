import { ComponentType, FC } from 'react';
import { ArticleItemType, Item, Layout } from '../Format';
import RectangleItem from './RectangleItem';
import { createUseStyles } from 'react-jss';
import { getLayoutStyles } from '../utils';

interface Props extends ItemComponentProps {
  layouts: Layout[];
}

interface ItemComponentProps {
  item: Item;
}

interface StyleParams {
  area: Item['area'];
  layouts: Layout[];
}

// @ts-ignore
const itemsMap: Record<ArticleItemType, ComponentType<ItemComponentProps>> = {
  [ArticleItemType.Rectangle]: RectangleItem
};

const useStyles = createUseStyles({
  item: ({ area, layouts }: StyleParams) => ({
    position: 'absolute',
    backgroundColor: '#000',
    ...getLayoutStyles(layouts, area, (area) => ({
      top: `${area.top * 100}vw`,
      left: `${area.left * 100}vw`,
      width: `${area.width * 100}vw`,
      height: `${area.height * 100}vw`,
      zIndex: area.zIndex
    }))
  })
});

const Item: FC<Props> = ({ item, layouts }) => {
  const styles = useStyles({ area: item.area, layouts });
  const ItemComponent = itemsMap[item.type];
  return (
    <div className={styles.item}>
      <ItemComponent item={item} />
    </div>
  );
};

export default Item;