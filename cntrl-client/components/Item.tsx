import { ComponentType, FC } from 'react';
import { ArticleItemType, Item, Layout } from '../Format';
import RectangleItem from './RectangleItem';
import { createUseStyles } from 'react-jss';
import { getLayoutStyles } from '../utils';
import ImageItem from './ImageItem';
import VideoItem from './VideoItem';

export interface ItemProps<I extends Item> {
  layouts: Layout[];
  item: I;
}

interface StyleParams {
  area: Item['area'];
  layouts: Layout[];
  layoutParams?: Item['layoutParams'];
}

const itemsMap: Record<ArticleItemType, ComponentType<ItemProps<any>>> = {
  [ArticleItemType.Rectangle]: RectangleItem,
  [ArticleItemType.Image]: ImageItem,
  [ArticleItemType.Video]: VideoItem,
  [ArticleItemType.Custom]: () => null,
  [ArticleItemType.Embed]: () => null,
  [ArticleItemType.RichText]: () => null,
  [ArticleItemType.Text]: () => null
};

const useStyles = createUseStyles({
  item: ({ area, layoutParams, layouts }: StyleParams) => {
    const layoutValues: Record<string, any>[] = [area];
    if (layoutParams) {
      layoutValues.push(layoutParams);
    }
    return {
      position: 'absolute',
      ...getLayoutStyles(layouts, layoutValues, ([area, layoutParams]) => ({
        top: `${area.top * 100}vw`,
        left: layoutParams?.fullwidth ? 0 : `${area.left * 100}vw`,
        width: layoutParams?.fullwidth ? '100vw' : `${area.width * 100}vw`,
        height: `${area.height * 100}vw`,
        zIndex: area.zIndex,
        transform: `rotate(${area.angle}deg)`
      }))
    };
  }
});

const noop = () => null;

const Item: FC<ItemProps<Item>> = ({ item, layouts }) => {
  const styles = useStyles({ area: item.area, layouts, layoutParams: item.layoutParams });
  const ItemComponent = itemsMap[item.type] || noop;
  return (
    <div className={styles.item}>
      <ItemComponent item={item} layouts={layouts} />
    </div>
  );
};

export default Item;
