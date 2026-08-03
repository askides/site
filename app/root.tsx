import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { themeScript } from './shared/theme';

import './styles/index.css';
import 'highlight.js/styles/obsidian.min.css';

const queryClient = new QueryClient();

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: must run before paint
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="antialiased font-sans">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />

        {/* External Scripts */}
        <script
          async
          src="//gc.zgo.at/count.js"
          data-goatcounter="https://askides.goatcounter.com/count"
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
