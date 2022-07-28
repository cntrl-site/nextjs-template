import { FC } from 'react';
//@ts-ignore
import JSXStyle from 'styled-jsx/style';
import { ItemProps } from './Item';
import { RichTextItem } from '../Format';
import { RichTextConv } from '../RichTextConv';

const richTextConv = new RichTextConv();

const RichTextItem: FC<ItemProps<RichTextItem>> = ({ item, layouts }) => {
  const [content, styles] = richTextConv.toHtml(item, layouts);
  console.log(styles);
  return (
    <>
      <div className="rich-text">{content}</div>
      <JSXStyle id={item.id}>
        {styles}
      </JSXStyle>
    </>
  );
};

export default RichTextItem;
