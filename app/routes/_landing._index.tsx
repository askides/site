import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useMutation } from '@tanstack/react-query';
import { ofetch } from 'ofetch';
import { useRef } from 'react';
import { getArticlesList } from '~/shared/articles';
import { createMetadata } from '~/shared/meta';
import { auth } from '~/shared/session';
import { ThemeToggle } from '~/shared/theme';

const work = [
  {
    period: '2024 – Present',
    role: 'Senior Frontend Engineer',
    meta: ['Toggl', 'Remote'],
  },
  {
    period: '2022 – 2024',
    role: 'Frontend Engineer',
    meta: ['Kaaja', 'Milan', 'Hybrid'],
  },
  {
    period: '2019 – 2021',
    role: 'Technical Lead',
    meta: ['Bluecube', 'Milan', 'On-site'],
  },
  {
    period: '2015 – 2019',
    role: 'Fullstack Engineer',
    meta: ['Bluecube', 'Milan', 'On-site'],
  },
];

// Keyed by what it is, not by a date: these are side projects, not positions.
const building = [
  {
    label: 'SaaS',
    name: 'Zilfu',
    url: 'https://zilfu.app',
    summary:
      "The social media scheduler for everyone tired of paying more to grow. I'm building it on my own, from design to deploy.",
  },
];

const elsewhere = [
  { label: 'GitHub', handle: 'askides', url: 'https://github.com/askides' },
  {
    label: 'LinkedIn',
    handle: 'in/askides',
    url: 'https://www.linkedin.com/in/askides/',
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.retrieve(request);
  const message = session.get('message');

  const stories = (await getArticlesList()).map((element) => ({
    ...element,
    year: String(new Date(element.date).getFullYear()),
  }));

  return json(
    { stories, message },
    { headers: { 'Set-Cookie': await auth.commit(session) } },
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
  "Travelling the world and meeting wonderful people who teach me how to live better every day. I'm 100% curious about everything.",
);

const link =
  'underline decoration-1 underline-offset-4 decoration-ink/25 hover:decoration-ink transition-colors';

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule pt-8">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Marks links that leave the site. Drawn rather than typed, so its weight
// tracks the surrounding text instead of depending on a font's arrow glyph.
function ExternalLink({
  href,
  className = '',
  children,
}: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} ${link}`}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="inline h-[0.6em] w-[0.6em] ml-[0.28em] align-baseline"
      >
        <path d="M2.4 7.6 7.6 2.4" />
        <path d="M3.6 2.4h4v4" />
      </svg>
    </a>
  );
}

// Separator is its own element so the dot keeps even spacing on both sides.
function Meta({ parts }: { parts: string[] }) {
  return (
    <p className="mt-1 text-[14px] text-muted">
      {parts.map((part, index) => (
        <span key={part}>
          {index > 0 && (
            <span aria-hidden="true" className="mx-2 text-muted/50">
              •
            </span>
          )}
          {part}
        </span>
      ))}
    </p>
  );
}

// The gutter is a key column, not strictly a date column: it also carries
// "GitHub", "Side project", and the like. Everything hangs off it.
function Row({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-8 sm:grid-cols-[7.5rem_1fr]">
      <div className="font-mono text-xs tabular-nums text-muted sm:pt-[3px]">
        {label}
      </div>
      <div className="mt-1 sm:mt-0">{children}</div>
    </div>
  );
}

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

    subscribe.mutate(email.current.value);
  };

  return (
    <>
      {message && (
        <p className="mb-16 font-mono text-xs text-ink border-l-2 border-ink pl-3 py-1">
          {message}
        </p>
      )}

      <header className="mb-16">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-[2.25rem] sm:text-[3rem] font-semibold tracking-[-0.025em] leading-none">
            Renato Pozzi
          </h1>
          <ThemeToggle />
        </div>
        <p className="mt-8 text-[17px] leading-relaxed max-w-[46ch]">
          Ten years building web products, mostly on the front end. Currently at{' '}
          <ExternalLink href="https://toggl.com">Toggl</ExternalLink>, working
          remote, and building{' '}
          <ExternalLink href="https://zilfu.app">Zilfu</ExternalLink> on the
          side. I'm curious about most things.
        </p>
      </header>

      <div className="space-y-14">
        <Section title="Work">
          <div className="space-y-6">
            {work.map((element) => (
              <Row key={element.period} label={element.period}>
                <p className="text-base font-medium leading-snug">
                  {element.role}
                </p>
                <Meta parts={element.meta} />
              </Row>
            ))}
          </div>
        </Section>

        <Section title="Building">
          <div className="space-y-6">
            {building.map((element) => (
              <Row key={element.name} label={element.label}>
                {element.url ? (
                  <ExternalLink
                    href={element.url}
                    className="text-base font-medium leading-snug"
                  >
                    {element.name}
                  </ExternalLink>
                ) : (
                  <p className="text-base font-medium leading-snug">
                    {element.name}
                  </p>
                )}
                <p className="mt-1 text-[14px] text-muted max-w-[46ch]">
                  {element.summary}
                </p>
              </Row>
            ))}
          </div>
        </Section>

        <Section title="Writing">
          <div className="space-y-5">
            {stories.map((element) => (
              <Row key={element.slug} label={element.year}>
                <Link
                  to={`/s/${element.slug}`}
                  className={`text-base leading-snug ${link}`}
                >
                  {element.title}
                </Link>
              </Row>
            ))}
          </div>
        </Section>

        <Section title="Elsewhere">
          <div className="space-y-5">
            {elsewhere.map((element) => (
              <Row key={element.url} label={element.label}>
                <ExternalLink
                  href={element.url}
                  className="text-base leading-snug"
                >
                  {element.handle}
                </ExternalLink>
              </Row>
            ))}
          </div>
        </Section>

        <Section title="Newsletter">
          <div>
            {/* Prose keeps a readable measure; the field spans the full column
                so its rule lines up with the section rules. */}
            <p className="text-[17px] leading-relaxed max-w-[46ch]">
              I send an email when I have something worth sending, once or twice
              a month. Unsubscribe any time.
            </p>

            <form
              className="mt-6 flex items-center gap-4 border-b border-ink/20 pb-2 focus-within:border-ink transition-colors"
              onSubmit={onSubmit}
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                className="flex-1 bg-transparent text-[17px] placeholder:text-muted/60 focus:outline-none"
                required
                ref={email}
              />
              <button
                type="submit"
                disabled={subscribe.isPending}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink focus-visible:text-ink focus-visible:outline-none focus-visible:underline underline-offset-4 transition-colors disabled:opacity-40"
              >
                {subscribe.isPending ? 'Sending' : 'Subscribe'}
              </button>
            </form>

            <output className="block mt-3 font-mono text-[11px] text-muted h-4">
              {subscribe.isSuccess && 'Check your inbox to confirm.'}
              {subscribe.isError && 'That did not go through. Try again.'}
            </output>
          </div>
        </Section>
      </div>
    </>
  );
}
