import { Layout } from './Format';
import { CSSProperties } from 'react';

export function getLayoutStyles<V, M extends object> (
  layouts: Layout[],
  layoutValues: Record<string, V>,
  mapToStyles: (values: V) => M): Record<string, any> {
  const mediaQueries = layouts.reduce((acc, layout) => {
    const value = layoutValues[layout.id] ?? getClosestLayoutValue(layoutValues, layouts, layout.id);
    return {
      ...acc,
      [`@media (min-width: ${layout.startsWith}px)`]: {
        ...mapToStyles(value)
      }
    };
  }, {});

  return mediaQueries;
}

const getClosestLayoutValue = <V>(map: Record<string, V>, layouts: Layout[], layoutId: string): V => {
  const index = layouts.findIndex(l => l.id === layoutId);
  if (index === -1) {
    throw new Error(`No layout was found by the given id #${layoutId}`);
  }
  const order = [
    layouts[index],
    ...layouts.slice(index + 1),
    ...layouts.slice(0, index).reverse()
  ];
  const found = order.find(layout => map.hasOwnProperty(layout.id));
  if (!found) {
    throw new Error('No layout data found');
  }
  return map[found.id];
}
