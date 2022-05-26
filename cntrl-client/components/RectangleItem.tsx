import { FC } from 'react';
import { Item } from '../Format';

interface Props {
  item: Item;
}

const RectangleItem: FC<Props> = ({ item }) => {
  return (
    <div>
      Rect!
    </div>
  );
};

export default RectangleItem;
