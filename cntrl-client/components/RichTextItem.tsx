import { FC } from 'react';
import { ItemProps } from './Item';
import { RichTextItem } from '../Format';
import { RichTextConv } from '../RichTextConv';


const richTextConv = new RichTextConv();

const RichTextItem: FC<ItemProps<RichTextItem>> = ({ item, layouts }) => {
  const sortedLayouts = layouts.slice().sort((a, b) => a.startsWith - b.startsWith);

  return (
    <>
      {
        sortedLayouts.map((l, i) => {
          const next = sortedLayouts[i + 1];
          return <>
            <div key={l.id} className={`rich-text-${l.id}`}>{richTextConv.toHtml(item, l.id, layouts)}</div>
            <style jsx>{`
              .rich-text-${l.id} {
                display: none;
              }
              @media (min-width: ${l.startsWith}px) and (max-width: ${next ? next.startsWith : Number.MAX_SAFE_INTEGER}px ) {
                .rich-text-${l.id} {
                  display: block;
                  word-break: break-word;
                }
              }
            `}</style>
          </>
        })
      }
    </>
  );
};

export default RichTextItem;
