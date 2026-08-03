import { Outlet } from '@remix-run/react';

export default function Page() {
  return (
    <main className="bg-paper text-ink min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-20 sm:py-28">
        <Outlet />
      </div>
    </main>
  );
}
