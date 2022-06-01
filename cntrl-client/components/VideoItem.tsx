import { FC } from 'react';
import { Layout, VideoItem } from '../Format';
import { ItemProps } from './Item';
import { createUseStyles } from 'react-jss';
import { getLayoutStyles } from '../utils';

interface StylesParams {
  layouts: Layout[];
  layoutParams: VideoItem['layoutParams'];
}

const useStyles = createUseStyles({
  videoItem: ({ layouts, layoutParams }: StylesParams) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    boxSizing: 'border-box',
    ...getLayoutStyles(layouts, [layoutParams],
      ([{ opacity, radius, strokeColor, strokeWidth }]) => ({
        opacity: opacity,
      }))
  })
});

const VideoItem: FC<ItemProps<VideoItem>> = ({ item, layouts}) => {
  // @ts-ignore
  const styles = useStyles({ layouts, layoutParams: item.layoutParams });

  return (
    <video autoPlay muted loop playsInline className={styles.videoItem}>
      <source src={item.commonParams.url} />
    </video>
  )
}

export default VideoItem;