import { Article, Meta, PageMeta, Project } from './Format';

const API_URL = process.env.CNTRL_API_URL;

export class CntrlClient {
  constructor(
    private projectId: string
  ) {}

  async getProject(): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${this.projectId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch project with id #${this.projectId}: ${response.statusText}`);
    }
    const data = await response.json() as Project;
    return data;
  }

  async getPageArticle(pageSlug: string): Promise<Article> {
    const projectResponse = await fetch(`${API_URL}/projects/${this.projectId}`);
    if (!projectResponse.ok) {
      throw new Error(`Failed to fetch project with id #${this.projectId}: ${projectResponse.statusText}`);
    }
    const data = await projectResponse.json() as Project;
    const page = data.pages.find((page) => page.slug === pageSlug);
    if (!page) {
      throw new Error(`Page with a slug ${pageSlug} was not found in project with id #${this.projectId}`);
    }

    const articleResponse = await fetch(`${API_URL}/articles/${page.articleId}`);
    if (!articleResponse.ok) {
      throw new Error(`Failed to fetch article with id #${page.articleId}: ${articleResponse.statusText}`);
    }
    const articleData = await articleResponse.json() as Article;

    return articleData;
  }

  public static getPageMeta(projectMeta: Meta, pageMeta: PageMeta): Meta {
    return {
      title: pageMeta.title ? pageMeta.title : projectMeta.title,
      description: pageMeta.description ? pageMeta.description : projectMeta.description,
      keywords: pageMeta.keywords ? pageMeta.keywords : projectMeta.keywords,
      opengraphThumbnail: pageMeta.opengraphThumbnail ? pageMeta.opengraphThumbnail : projectMeta.opengraphThumbnail,
      favicon: projectMeta.favicon
    };
  }
}
