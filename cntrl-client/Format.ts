// TODO consider shared types with all others

export interface RichTextEntity {
  start: number;
  end: number;
  // TODO: @tkustov update with enum
  type: string;
  data?: any;
}

export interface RichTextStyle {
  start: number;
  end: number;
  style: string;
  value?: string;
}

export interface RichTextBlock {
  start: number;
  end: number;
  type: string;
  entities?: RichTextEntity[];
  children?: RichTextBlock[];
  data?: any;
}


export enum ArticleItemType {
  Image = 'image',
  Text = 'text',
  RichText = 'richtext',
  Video = 'video',
  Rectangle = 'rectangle',
  Embed = 'embed',
  Custom = 'custom'
}

export enum TextAlign {
  Start = 'start',
  End = 'end',
  Center = 'center',
  Justify = 'justify'
}

export interface RichTextStyle {
  start: number;
  end: number;
  style: string;
  value?: string;
}

export interface Meta {
  favicon?: string;
  title?: string;
  description?: string;
  keywords?: string;
  opengraphThumbnail?: string;
}

interface Fonts {
  google: string;
  adobe: string;
}

export interface Layout {
  startsWith: number;
  id: string;
}

export interface AdditionalHTML {
  head: string;
  afterBodyOpen: string;
  beforeBodyClose: string;
}

export interface Project {
  title: string;
  meta: Meta;
  pages: TPage[];
  layouts: Layout[];
  html: AdditionalHTML;
  fonts: Fonts;
}

export interface PageMeta {
  title?: string;
  description?: string;
  keywords?: string;
  opengraphThumbnail?: string;
}

export interface TPage {
  title: string;
  articleId: string;
  slug: string;
  meta: PageMeta;
}

export interface Article {
  id: string;
  sections: Section[];
}

export interface Section {
  id: string;
  height: Record<LayoutId, number>;
  visible: Record<LayoutId, boolean>;
  items: Item[];
}

export type Item =
  | ImageItem
  | VideoItem
  | TextItem
  | RichTextItem
  | RectangleItem
  | EmbedItem
  | CustomItem;

export interface ItemArea {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  angle: number;
}

type LayoutId = string;

interface Link {
  url: string;
  target: string;
}

interface ItemBase {
  id: string;
  area: Record<LayoutId, ItemArea>;
  visible: Record<LayoutId, boolean>;
  type: ArticleItemType;
  link?: Link;
  commonParams?: any;
  layoutParams?: Record<LayoutId, any>;
}

export interface ImageItem extends ItemBase {
  type: ArticleItemType.Image;
  commonParams: {
    url: string;
  };
  layoutParams: Record<
    LayoutId,
    {
      fullwidth: boolean;
      opacity: number;
      radius: number;
      strokeWidth: number;
      strokeColor: string;
      strokeOpacity: number;
    }
    >;
}

export interface VideoItem extends ItemBase {
  type: ArticleItemType.Video;
  commonParams: {
    url: string;
  };
  layoutParams: Record<
    LayoutId,
    {
      fullwidth: boolean;
      autoplay: boolean;
      radius: number;
      opacity: number;
      strokeWidth: number;
      fillColor: string;
      strokeColor: string;
      strokeOpacity: number;
    }
    >;
}

export interface TextItem extends ItemBase {
  type: ArticleItemType.Text;
  commonParams: {
    content: string;
    fontFamily: string;
    fontStyle: string;
  };
  layoutParams: Record<
    LayoutId,
    {
      align: TextAlign;
      fontSize: number;
      letterSpacing: number;
      lineHeight: number;
      opacity: number;
      textColor: string;
      wordSpacing: number;
    }
    >;
}

export interface RichTextItem extends ItemBase {
  type: ArticleItemType.RichText,
  commonParams: {
    text: string;
    blocks?: RichTextBlock[];
    styles?: RichTextStyle[];
  },
  layoutParams: Record<LayoutId, {
    styles?: RichTextStyle[];
    opacity: number;
  }>
}

export interface RectangleItem extends ItemBase {
  type: ArticleItemType.Rectangle;
  layoutParams: Record<
    LayoutId,
    {
      radius: number;
      opacity: number;
      strokeWidth: number;
      fillColor: string;
      strokeColor: string;
      strokeOpacity: number;
      fullwidth: boolean;
    }
    >;
}

export interface EmbedItem extends ItemBase {
  type: ArticleItemType.Embed;
  commonParams: {
    content: string;
  };
}

export interface CustomItem extends ItemBase {
  type: ArticleItemType.Custom;
  commonParams?: any;
}
