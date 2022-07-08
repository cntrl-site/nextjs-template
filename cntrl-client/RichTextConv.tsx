import { CSSProperties, ReactElement, ReactNode } from 'react';
import { Layout, RichTextEntity, RichTextItem, RichTextStyle, TextTransform, VerticalAlign } from './Format';
import { getClosestLayoutValue } from './utils';

interface StyleGroup {
  start: number;
  end: number;
  styles: DraftStyle[];
}

interface EntitiesGroup {
  link?: string;
  stylesGroup: StyleGroup[];
  start: number;
  end: number;
}

interface DraftStyle {
  name: string;
  value?: string;
}

export const FontStyles: Record<string, CSSProperties> = {
  'normal': {},
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' }
};

export class RichTextConv {
  toHtml(richText: RichTextItem, layoutId: string, layouts: Layout[]): ReactElement {
    const { text, blocks = [] } = richText.commonParams;
    const { styles } = getClosestLayoutValue(richText.layoutParams, layouts, layoutId);
    const root: ReactElement[] = [];

    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
      const block = blocks[blockIndex];
      const kids: ReactNode[] = [];
      const content = text.slice(block.start, block.end);
      const entities = block.entities!.sort((a, b) => a.start - b.start) ?? [];
      const stylesGroup = this.normalizeStyles(
        styles!
          .filter(s => s.start >= block.start && s.end <= block.end)
          .map(s => ({...s, start: s.start - block.start, end: s.end - block.start})),
        entities.sort((a, b) => a.start - b.start)
      );
      const entitiesGroups = this.groupEntities(entities, stylesGroup);
      let offset = 0;

      if (!entitiesGroups) {
        root.push(<div key={`rootContent-${blockIndex}`}>{content}</div>);
        continue;
      }

      for (const entity of entitiesGroups) {
        const stylesBlocks: ReactNode[] = [];
        const link = entity.link;

        if (offset < entity.start) {
          kids.push(content.slice(offset, entity.start));
        }

        for (let stylesIndex = 0; stylesIndex < entity.stylesGroup.length; stylesIndex++) {
          const style = entity.stylesGroup[stylesIndex];
          if (offset < style.start) {
            stylesBlocks.push(content.slice(offset, style.start));
          }

          const inlineStyles = style.styles.reduce((acc, s) => {
            const styles = RichTextConv.fromDraftToInline(s);
            return { ...acc, ...styles }
          }, {});
          stylesBlocks.push(
            <span
              key={stylesIndex}
              style={inlineStyles}
            >
              {content.slice(style.start, style.end)}
            </span>
          );
          offset = style.end;
        }

        if (offset < entity.end) {
          stylesBlocks.push(content.slice(offset, entity.end));
        }

        const stylesContent = link ? <a target="_blank" href={link} rel="noreferrer">{stylesBlocks}</a> : stylesBlocks;
        kids.push(stylesContent);
      }

      if (offset < block.end) {
        kids.push(content.slice(offset, block.end));
      }

      const textAlign = richText.layoutParams[layoutId]?.textAlign;
      root.push(<div key={`rootContent-${blockIndex}`} style={{textAlign: textAlign}}>{kids}</div>);
    }
    return <>{root}</>;
  }

  private normalizeStyles(styles: RichTextStyle[], entities: RichTextEntity[]): StyleGroup[] | undefined {
    const styleGroups: StyleGroup[] = [];
    const dividers = [...styles, ...entities].reduce((ds, s) => {
      ds.add(s.start);
      ds.add(s.end);
      return ds;
    }, new Set<number>());
    if (dividers.size === 0) return;
    const edges = Array.from(dividers).sort((a, b) => a - b);
    for (let i = 0; i < edges.length - 1; i += 1) {
      const start = edges[i];
      const end = edges[i + 1];
      const applied = styles.filter(s => Math.max(s.start, start) < Math.min(s.end, end));
      if (applied.length === 0) continue;
      styleGroups.push({
        start,
        end,
        styles: applied.map(s => ({ name: s.style, value: s.value }))
      })
    }

    return styleGroups;
  }

  private groupEntities(entities: RichTextEntity[], styleGroups?: StyleGroup[]): EntitiesGroup[] | undefined {
    const entitiesGroups: EntitiesGroup[] = [];
    if (!styleGroups) return;
    if (entities.length) {
      const start = entities[0].start < styleGroups[0].start ? entities[0].start : styleGroups[0].start;
      const end = entities[entities.length - 1].end > styleGroups[styleGroups.length - 1].end ? entities[entities.length - 1].end : styleGroups[styleGroups.length - 1].end;
      const entitiesDividers = entities.reduce((ds, s) => {
        ds.add(s.start);
        ds.add(s.end);
        return ds;
      }, new Set<number>([start, end]));
      const entityDividers = Array.from(entitiesDividers).sort((a, b) => a - b);

      for (let i = 0; i < entityDividers.length - 1; i += 1) {
        const start = entityDividers[i];
        const end = entityDividers[i + 1];
        const entity = entities.find(e => e.start === start);
        entitiesGroups.push({
          stylesGroup: styleGroups.filter(s => s.start >= start && s.end <= end),
          start,
          end,
          ...(entity && { link: entity.data.url })
        });
      }
    } else {
      entitiesGroups.push({
        stylesGroup: styleGroups,
        start: styleGroups[0].start,
        end: styleGroups[styleGroups.length - 1].end
      });
    }

    return entitiesGroups;
  }

  private static fromDraftToInline (draftStyle: DraftStyle) {
    const { value, name } = draftStyle;
    const map: Record<string, any> = {
      'COLOR': { color: value },
      'TYPEFACE': { fontFamily: value },
      'FONTSTYLE': value ? { ...FontStyles[value] } : {},
      'FONTWEIGHT': { fontWeight: value },
      'FONTSIZE': { fontSize: `${parseFloat(value!) * 100}vw` },
      'LINEHEIGHT': { lineHeight: `${parseFloat(value!) * 100}vw` },
      'LETTERSPACING': { letterSpacing: `${parseFloat(value!) * 100}vw` },
      'WORDSPACING': { wordSpacing: `${parseFloat(value!) * 100}vw` },
      'TEXTTRANSFORM': value ? { textTransform: value as TextTransform } : { textTransform: TextTransform.None },
      'VERTICALALIGN': value ? { verticalAlign: value as VerticalAlign } : { verticalAlign: VerticalAlign.Unset },
      'TEXTDECORATION': { textDecoration: value }
    };

    return map[name];
  }
}
