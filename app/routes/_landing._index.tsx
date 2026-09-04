import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useMutation } from '@tanstack/react-query';
import { ofetch } from 'ofetch';
import { useRef } from 'react';
import { getArticlesList } from '~/shared/articles';
import { createMetadata } from '~/shared/meta';
import { building, elsewhere, profile, work } from '~/shared/resume';
import { auth } from '~/shared/session';
import { ThemeToggle } from '~/shared/theme';

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
  { imageUrl: '/og.png' },
);

const link =
  'underline decoration-1 underline-offset-4 decoration-ink/25 hover:decoration-ink transition-colors';

const recommendations = [
  {
    author: 'Jeremy Tan',
    authorUrl: 'https://www.linkedin.com/in/jeremy-tan311/',
    photo: '/assets/jeremy-tan.jpg',
    role: 'Senior PM at Toggl',
    date: 'Aug 26, 2026',
    relationship: 'Worked with me on the same team',
    preview: 'Strong drive for quality, with the courage to push back.',
    teaser:
      "I've really enjoyed working with Renny. He's an engineer who combines a strong drive for quality with genuine willingness to learn and take on new challenges.",
    body: [
      "Despite taking ownership of multiple concurrent projects, he remains focused on delivering high quality work rather than simply getting things done quickly. I also value that he isn't afraid to push back when he believes there is a better solution always with the goal of achieving the best outcome.",
      'He strikes for excellence, takes pride in his work and has a genuine curiosity that pushes him to keep learning. Any team that has the pleasure of working with him would be lucky.',
    ],
  },
  {
    author: 'Kristy Christie',
    authorUrl: 'https://www.linkedin.com/in/kristych/',
    photo: '/assets/kristy-christie.jpg',
    role: 'B2B Product Manager',
    date: 'Aug 1, 2026',
    relationship: 'Managed me directly',
    preview: 'Give him the big, messy work. He will get it done.',
    teaser:
      'Renato worked with me at Toggl and was one of my top engineers. He is the kind of professional that I could go to when something was big, messy and that most people would struggle to get finished.. And he would get it done.',
    body: [
      'The clearest example is the full revamp of the Toggl browser extension, which he took on with one other FE engineer. It was a complex, tedious piece of work that needed to work on multiple browser surfaces, with a hundred small details that could quietly break the core time tracking experience, and the two of them carried it the whole way.',
      "What I especially appreciated was Renato's proactive communication through the project - which was excellent. I always knew where things stood, what was at risk and what he needed from me.",
      "He can own a large project with no hand-holding, he's just as good working alongside others, and he's genuinely fast without the quality slipping. He thinks about the product & business outcomes, and having him elevates projects beyond their spec. I recommend him wholeheartedly and hope to work with him again.",
    ],
  },
] as const;

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

// Ties single-letter words to the word after them, so a line never ends on a
// stray "A" or "I". text-wrap: pretty only guards the last line.
function typeset(text: string) {
  return text.replace(/(^|\s)(\w)\s+/g, '$1$2 ');
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

function Recommendation({
  recommendation,
}: { recommendation: (typeof recommendations)[number] }) {
  return (
    <details className="group/recommendation">
      <summary className="-mx-2 grid cursor-pointer list-none grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-sm px-2 py-2 marker:hidden transition-colors hover:bg-paper/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 [&::-webkit-details-marker]:hidden">
        <img
          src={recommendation.photo}
          alt=""
          width={40}
          height={40}
          className="h-9 w-9 rounded-sm object-cover ring-1 ring-ink/10"
        />

        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-2 text-[13px] leading-snug">
            <span className="font-medium">{recommendation.author}</span>
            <span className="text-[11px] text-muted">
              {recommendation.relationship}
            </span>
          </p>
          <p className="mt-0.5 truncate text-[13px] text-ink/65">
            {recommendation.preview}
          </p>
        </div>

        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors group-hover/recommendation:text-ink">
          <span className="group-open/recommendation:hidden">Read</span>
          <span className="hidden group-open/recommendation:inline">Close</span>
        </span>
      </summary>

      <div className="recommendation-body pb-4 pl-12 pr-1 pt-2">
        <blockquote>
          <div className="space-y-3 text-pretty text-[13px] leading-relaxed text-ink/70">
            <p>{recommendation.teaser}</p>
            {recommendation.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <footer className="mt-4 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
            <ExternalLink href={recommendation.authorUrl}>
              {recommendation.author}
            </ExternalLink>
            <span aria-hidden="true" className="mx-2 text-muted/50">
              •
            </span>
            <span>{recommendation.role}</span>
            <span aria-hidden="true" className="mx-2 text-muted/50">
              •
            </span>
            <span>{recommendation.date}</span>
          </footer>
        </blockquote>
      </div>
    </details>
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

      <header className="mb-16 after:block after:clear-both after:content-['']">
        <img
          src={profile.photo}
          alt="Portrait of Renato Pozzi"
          width={900}
          height={1200}
          className="float-none mb-8 h-32 w-32 rounded-sm object-cover object-[50%_38%] ring-1 ring-ink/10 sm:float-right sm:ml-10 sm:mb-4 sm:h-44 sm:w-32"
        />

        <h1 className="text-[2.25rem] sm:text-[3rem] font-semibold tracking-[-0.025em] leading-none">
          Renato Pozzi
        </h1>
        <p className="mt-8 text-pretty text-[17px] leading-relaxed max-w-[46ch]">
          Ten years building web products. Currently at{' '}
          <ExternalLink href="https://toggl.com">Toggl</ExternalLink>, working
          remote, and building{' '}
          <ExternalLink href="https://zilfu.app">Zilfu</ExternalLink> on the
          side. I'm curious about most things.
        </p>

        <div className="mt-7 flex items-center gap-7">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink focus-visible:text-ink focus-visible:outline-none focus-visible:underline underline-offset-4 transition-colors"
          >
            Resume PDF
            <svg
              aria-hidden="true"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[0.85em] w-[0.85em]"
            >
              <path d="M2.4 7.6 7.6 2.4" />
              <path d="M3.6 2.4h4v4" />
            </svg>
          </a>

          <ThemeToggle />
        </div>
      </header>

      <div className="space-y-14">
        <section
          aria-labelledby="recommendations-heading"
          className="rounded-sm bg-ink/[0.035] px-4 py-4 sm:px-5"
        >
          <h2 id="recommendations-heading" className="sr-only">
            Recommendations
          </h2>

          <div className="space-y-1">
            {recommendations.map((recommendation) => (
              <Recommendation
                key={recommendation.author}
                recommendation={recommendation}
              />
            ))}
          </div>

          <a
            href="https://www.linkedin.com/in/askides/details/recommendations/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none focus-visible:underline underline-offset-4"
          >
            <span>View on LinkedIn</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-2.5 w-2.5"
            >
              <path d="M2.4 7.6 7.6 2.4" />
              <path d="M3.6 2.4h4v4" />
            </svg>
          </a>
        </section>

        <Section title="Work">
          <div className="space-y-6">
            {work.map((element) => (
              <Row key={element.period} label={element.period}>
                <p className="text-base font-medium leading-snug">
                  {element.role}
                </p>
                <Meta parts={element.meta} />

                {element.summary && (
                  <p className="mt-3 max-w-[46ch] text-pretty text-[13px] leading-relaxed text-ink/70">
                    {typeset(element.summary)}
                  </p>
                )}
              </Row>
            ))}
          </div>
        </Section>

        <Section title="Building">
          <div className="space-y-6">
            {building.map((element) => (
              <Row key={element.name} label={element.label}>
                <div className="flex flex-wrap items-baseline gap-x-3">
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

                  {/* Rides the name's line: a note about the project, not a
                      field of its own. */}
                  {element.meta && (
                    <span className="font-mono text-[11px] text-muted">
                      {element.meta.join(' · ')}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-pretty text-[13px] leading-relaxed text-muted max-w-[46ch]">
                  {typeset(element.summary)}
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
