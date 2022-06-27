import { ComponentType, FC } from 'react';
import { ArticleItemType, Item, Layout } from '../Format';
import RectangleItem from './RectangleItem';
import { getLayoutStyles } from '../utils';
import ImageItem from './ImageItem';
import VideoItem from './VideoItem';
import RichTextItem from './RichTextItem';

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
  [ArticleItemType.RichText]: RichTextItem,
  [ArticleItemType.Text]: () => null
};

const noop = () => null;

const Item: FC<ItemProps<Item>> = ({ item, layouts }) => {
  const layoutValues: Record<string, any>[] = [item.area];
  if (item.layoutParams) {
    layoutValues.push(item.layoutParams);
  }

  const ItemComponent = itemsMap[item.type] || noop;

  return (
    <div className={`item-${item.id}`}>
      <ItemComponent item={item} layouts={layouts} />
      <style jsx>{`
        ${getLayoutStyles(layouts, layoutValues, ([area, layoutParams]) => (`
           .item-${item.id} {
              position: absolute;
              top: ${area.top * 100}vw;
              left: ${layoutParams?.fullwidth ? 0 : area.left * 100}vw;
              width: ${layoutParams?.fullwidth ? '100vw' : area.width * 100}vw;
              height: ${area.height * 100}vw;
              z-index: ${area.zIndex};
              transform: rotate(${area.angle}deg);
            }
        `))}
      `}</style>
    </div>
  );
};

export default Item;
