import { readFile, readdir } from 'node:fs/promises';
import { marked } from 'marked';
import path from 'node:path';
import matter from 'front-matter';

interface ArticleAttributes {
  title: string;
  date: string;
  description: string;
}

interface ArticlePreview extends ArticleAttributes {
  slug: string;
}

interface Article extends ArticlePreview {
  content: string;
}

const ARTICLES_PATH = path.join(process.cwd(), './app/shared/articles');

async function getAllMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getAllMarkdownFiles(fullPath);
      }

      if (entry.name.endsWith('.mdx')) {
        return [fullPath];
      }

      return [];
    })
  );
  return files.flat();
}

export async function getArticlesList(): Promise<ArticlePreview[]> {
  const files = await getAllMarkdownFiles(ARTICLES_PATH);

  const articles = await Promise.all(
    files.map(async (filePath) => {
      const content = await readFile(filePath, 'utf-8');
      const { attributes } = matter(content) as {
        attributes: ArticleAttributes;
      };

      const relativePath = path.relative(ARTICLES_PATH, filePath);

      return {
        slug: relativePath.replace(/\.mdx$/, ''),
        title: attributes.title,
        description: attributes.description,
        date: attributes.date,
      };
    })
  );

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const filePath = path.join(ARTICLES_PATH, `${slug}.mdx`);
    const content = await readFile(filePath, 'utf-8');

    const { attributes, body } = matter(content) as {
      attributes: ArticleAttributes;
      body: string;
    };

    const html = await marked(body);

    return {
      slug,
      title: attributes.title,
      description: attributes.description,
      date: attributes.date,
      content: html,
    };
  } catch (error) {
    return null;
  }
}
