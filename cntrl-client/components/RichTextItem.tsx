import { FC } from 'react';
import { ItemProps } from './Item';
import { RichTextItem } from '../Format';
import { RichTextConv } from '../RichTextConv';

const richTextConv = new RichTextConv();

const RichTextItem: FC<ItemProps<RichTextItem>> = ({ item, layouts }) => {
  const sortedLayouts = layouts.slice().sort((a, b) => a.startsWith - b.startsWith);
  const styles = sortedLayouts.map((l, i) => {
    const next = sortedLayouts[i + 1];
    return (
      `
        .rich-text-${l.id} {
          display: none;
        }
        @media (min-width: ${l.startsWith}px) and (max-width: ${next ? next.startsWith : Number.MAX_SAFE_INTEGER}px ) {
          .rich-text-${l.id} {
            display: block;
          }
        }
      `
    );
  }).join('\n');

  return (
    <>
      {sortedLayouts.map((l) => (
        <div key={l.id} className={`rich-text-${l.id}`}>{richTextConv.toHtml(item, l.id, layouts)}</div>
      ))}
      <style jsx>
        {styles}
      </style>
    </>
  );
};

export default RichTextItem;
