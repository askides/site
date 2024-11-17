import { getArticlesList } from '~/shared/articles';

interface SitemapUrl {
  path: string;
  priority?: number;
  lastmod?: string;
}

export const loader = async () => {
  const baseUrl = process.env.APP_URL || 'https://example.com';

  const urls: SitemapUrl[] = [
    { path: '/', priority: 1.0 },
    // Add more URLs as needed
  ];

  // Include all articles
  const articles = await getArticlesList();

  urls.push(...articles.map((article) => ({ path: `/s/${article.slug}` })));

  // Generate XML entries
  const xmlEntries = urls
    .map(
      ({ path, priority = 0.5, lastmod = new Date().toISOString() }) => `
        <url>
          <loc>${baseUrl}${path}</loc>
          <lastmod>${lastmod}</lastmod>
          <priority>${priority}</priority>
        </url>
      `
    )
    .join('');

  // Create complete XML content
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${xmlEntries}
      </urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};
