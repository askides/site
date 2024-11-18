import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/index.css';
import 'highlight.js/styles/obsidian.min.css';

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased">
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
