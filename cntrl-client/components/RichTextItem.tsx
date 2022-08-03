import { FC } from 'react';
//@ts-ignore
import JSXStyle from 'styled-jsx/style';
import { ItemProps } from './Item';
import { RichTextItem } from '../Format';
import { RichTextConv } from '../RichTextConv';

const richTextConv = new RichTextConv();

const RichTextItem: FC<ItemProps<RichTextItem>> = ({ item, layouts }) => {
  const [content, styles] = richTextConv.toHtml(item, layouts);
  return (
    <>
      <div className="rich-text" style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
      <JSXStyle id={item.id}>
        {styles}
      </JSXStyle>
    </>
  );
};

export default RichTextItem;
