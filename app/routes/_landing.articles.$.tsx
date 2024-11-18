import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params['*'];

  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  return redirect(`/s/${slug.split('/').pop()}`);
}
