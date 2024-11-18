import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

// Add loader function to handle redirects
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  console.log(url.pathname);

  // Define your permanent redirects mapping
  const urls: Record<string, string> = {
    '/articles/your-nextjs-bundle-will-thank-you':
      '/s/your-nextjs-bundle-will-thank-you',
    '/articles/how-to-use-tailwind-css-with-nextjs-and-typescript':
      '/s/how-to-use-tailwind-css-with-nextjs-and-typescript',
  };

  // Check if current path needs to be redirected
  const redirectTo = urls[url.pathname];

  if (redirectTo) {
    return redirect(redirectTo, { status: 301 });
  }

  return null;
}

export default function Page() {
  return (
    <main className="bg-zinc-50 min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-16">
        <Outlet />
      </div>
    </main>
  );
}
