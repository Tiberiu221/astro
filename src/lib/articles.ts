import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

/** All articles, newest first. */
export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('articles');
  return articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function articleUrl(article: Article): string {
  return `/articole/${article.id}/`;
}

// UTC so the date does not shift by a day when the build runs in another time zone.
const dateFormat = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** Reading time in minutes at ~200 words per minute, at least 1. */
export function readingTime(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
