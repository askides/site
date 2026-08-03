import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getArticle } from '~/shared/articles';
import { createMetadata } from '~/shared/meta';
import { ThemeToggle } from '~/shared/theme';

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params['*'];

  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  const article = await getArticle(slug);

  if (!article) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ article });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.article) {
    throw new Response('Not Found', { status: 404 });
  }

  return createMetadata(data.article.title, data.article.description, {
    canonicalPath: `/s/${data.article.slug}`,
  });
};

export default function Page() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="mb-10 flex items-center justify-between gap-6">
        <a
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink transition-colors"
        >
          &larr; Back
        </a>
        <ThemeToggle />
      </div>
      <article className="prose dark:prose-invert prose-headings:text-base prose-h1:text-lg prose-headings:font-semibold prose-pre:p-0 scrollbar-thin">
        <h1>{article.title}</h1>

        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml:
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </>
  );
}
