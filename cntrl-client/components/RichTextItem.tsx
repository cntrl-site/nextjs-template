import { FC } from 'react';
import { ItemProps } from './Item';
import { RichTextItem } from '../Format';
import { RichTextConv } from '../RichTextConv';

const richTextConv = new RichTextConv();

const RichTextItem: FC<ItemProps<RichTextItem>> = ({ item, layouts }) => {
  return (
    <div className={`rich-text`}>{richTextConv.toHtml(item, layouts)}</div>
  );
};

export default RichTextItem;
