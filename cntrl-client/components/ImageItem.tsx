import { FC } from 'react';
import { ItemProps } from './Item';
import { createUseStyles } from 'react-jss';
import { getLayoutStyles } from '../utils';
import { ImageItem, Layout } from '../Format';

interface StylesParams {
  layouts: Layout[];
  layoutParams: ImageItem['layoutParams'];
}

const useStyles = createUseStyles({
  imageItem: ({ layouts, layoutParams }: StylesParams) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    ...getLayoutStyles(layouts, [layoutParams],
      ([{ opacity, radius, strokeColor, strokeWidth }]) => ({
        opacity: opacity,
        borderColor: strokeColor,
        borderRadius: `${radius * 100}vw`,
        borderWidth: `${strokeWidth * 100}vw`
    }))
  })
});

const ImageItem: FC<ItemProps<ImageItem>> = ({ item, layouts }) => {
  const styles = useStyles({ layouts, layoutParams: item.layoutParams });
  return (
    <img src={item.commonParams.url} className={styles.imageItem} />
  )
}

export default ImageItem;
