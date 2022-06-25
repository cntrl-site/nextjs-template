import { FC } from 'react';
import { ItemProps } from './Item';
import { getLayoutStyles } from '../utils';
import { ImageItem } from '../Format';

const ImageItem: FC<ItemProps<ImageItem>> = ({ item, layouts }) => {
  return (
    <>
      <div className={`image-wrapper-${item.id}`}>
        <img className="image" src={item.commonParams.url}  />
      </div>
      <style jsx>{`
      ${
        getLayoutStyles(layouts, [item.layoutParams], ([{ strokeColor, radius, strokeWidth }]) => (`
           .image-wrapper-${item.id} {
              position: absolute;
              width: 100%;
              height: 100%;
              border-style: solid;
              box-sizing: border-box;
              border-color: ${strokeColor};
              border-radius: ${radius * 100}vw;
              border-width: ${strokeWidth * 100}vw;
            }`
        ))
      }
      .image {
        width: 100%;
        height: 100%;
        opacity: 1;
        object-fit: cover;
        pointer-events: none;
      }
      `}</style>
    </>
  )
}

export default ImageItem;
