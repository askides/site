import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useMutation } from '@tanstack/react-query';
import { ofetch } from 'ofetch';
import { useRef } from 'react';
import { getArticlesList } from '~/shared/articles';
import { createMetadata } from '~/shared/meta';
import { auth } from '~/shared/session';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.retrieve(request);
  const message = session.get('message');

  return json(
    {
      stories: await getArticlesList(),
      message,
    },
    {
      headers: {
        'Set-Cookie': await auth.commit(session),
      },
    }
  );
}

const useSubscribeMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return ofetch('/api/subscribe', { method: 'POST', body: { email } });
    },
  });
};

export const meta = createMetadata(
  'Renato Pozzi | Nomad, Software Engineer & Polymath',
  "Travelling the world and meeting wonderful people who teach me how to live better every day. I'm 100% curious about everything."
);

export default function Page() {
  const { stories, message } = useLoaderData<typeof loader>();
  const subscribe = useSubscribeMutation();
  const email = useRef<HTMLInputElement>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission.
    event.preventDefault();

    if (!email.current?.value) {
      return false;
    }

    subscribe.mutate(email.current.value, {
      onSuccess: () => {
        alert('Done! Now check your inbox.');
      },
    });
  };

  return (
    <>
      {message && (
        <div className="mb-16 p-4 bg-green-200 border border-green-300 text-green-700">
          {message}
        </div>
      )}

      <header className="mb-16">
        <h1 className="font-semibold mb-4 text-lg text-zinc-900">
          Renato Pozzi
        </h1>
        <p className="text-zinc-900 leading-relaxed">
          Nomad, Engineer, maker of things. I love traveling the world and
          meeting wonderful people who teach me how to live better every day.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="font-semibold mb-4 text-zinc-900">Stories</h2>

        <ol className="list-decimal list-inside space-y-2">
          {stories.map((element) => (
            <li key={element.slug} className="text-zinc-900">
              <Link
                to={`/s/${element.slug}`}
                className="ml-2 text-indigo-500 hover:underline transition-colors"
              >
                {element.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="max-w-xl">
          <h2 className="font-semibold mb-4">Stay in the Loop</h2>
          <p className="text-zinc-900 mb-8 leading-relaxed">
            I'll send you an email when I have some news. No fuss, no spam. I
            write about once or twice a month. Unsubscribe at any time.
          </p>
          <form className="flex gap-3" onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              placeholder="steve.wozniak@gmail.com"
              className="flex-1 px-4 py-3 rounded-lg border-0 ring-1 ring-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              required
              ref={email}
            />
            <button
              type="submit"
              disabled={subscribe.isPending}
              className="bg-zinc-900 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-zinc-800 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subscribe.isPending ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
