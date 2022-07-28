import { Layout } from './Format';

export enum SizingTypes {
  Auto = 'auto',
  Manual = 'manual',
}

interface Axis {
  x: SizingTypes;
  y: SizingTypes;
}

export function getLayoutStyles<V, M> (
  layouts: Layout[],
  layoutValues: Record<string, V>[],
  mapToStyles: (values: V[]) => M): string {
  const mediaQueries = layouts.sort((a, b) => a.startsWith - b.startsWith).reduce((acc, layout) => {
    const values = layoutValues.map(lv => lv[layout.id] ?? getClosestLayoutValue(lv, layouts, layout.id));
    return `
      ${acc}
      ${layout.startsWith !== 0
        ? `@media (min-width: ${layout.startsWith}px) {${mapToStyles(values)}}`
        : `${mapToStyles(values)}`
      }`;
  }, '');
  return mediaQueries;
}

export function getLayoutMediaQuery(layoutId: string, layouts: Layout[]): string {
  const sorted = layouts.slice().sort((a, b) => a.startsWith - b.startsWith);
  const layoutIndex = sorted.findIndex(l => l.id === layoutId);
  if (layoutIndex === -1) {
    throw new Error(`No layout was found by the given id #${layoutId}`);
  }
  const current = sorted[layoutIndex];
  const next = sorted[layoutIndex + 1];
  if (!next) {
    return `@media (min-width: ${current.startsWith}px)`;
  }
  return `@media (min-width: ${current.startsWith}px) and (max-width: ${next.startsWith - 1}px)`;
}

export const getClosestLayoutValue = <V>(map: Record<string, V>, layouts: Layout[], layoutId: string): V => {
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

export const parseSizing = (sizing: string): Axis => {
  const axisSizing = sizing.split(' ');
  return {
    y: axisSizing[0],
    x: axisSizing[1] ? axisSizing[1] : axisSizing[0]
  } as Axis;
};

export const groupBy = <I>(items: I[], getKey: (item: I) => PropertyKey): Record<PropertyKey, I[]> => {
  const groups: Record<PropertyKey, I[]> = {};
  for (const item of items) {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key]!.push(item);
  }
  return groups;
};
