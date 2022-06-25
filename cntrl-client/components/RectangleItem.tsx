import { FC } from 'react';
import { Layout, RectangleItem } from '../Format';
import { getLayoutStyles } from '../utils';
import { ItemProps } from './Item';

interface StylesParams {
  layouts: Layout[];
  layoutParams: RectangleItem['layoutParams'];
}

const RectangleItem: FC<ItemProps<RectangleItem>> = ({ item, layouts }) => {
  return (
    <>
      <div className={`rectangle-${item.id}`} />
      <style jsx>{`
      ${
        getLayoutStyles(layouts, [item.layoutParams], ([{ strokeColor, fillColor, radius, strokeWidth }]) => (`
           .rectangle-${item.id} {
              position: absolute;
              width: 100%;
              height: 100%;
              border-style: solid;
              box-sizing: border-box;
              border-color: ${strokeColor};
              background-color: ${fillColor};
              border-radius: ${radius * 100}vw;
              border-width: ${strokeWidth * 100}vw;
            }`
        ))
      }
      `}</style>
    </>
  );
};

export default RectangleItem;
