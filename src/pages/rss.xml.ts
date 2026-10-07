import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { articleUrl, getArticles } from '../lib/articles';

export async function GET(context: APIContext) {
  if (!context.site) throw new Error('Set `site` in astro.config.mjs: the RSS feed needs absolute URLs.');

  const articles = await getArticles();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: articleUrl(article),
      categories: article.data.tags,
    })),
    customData: '<language>ro</language>',
  });
}
