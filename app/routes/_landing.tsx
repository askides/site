import { Outlet } from '@remix-run/react';

export default function Page() {
  return (
    <main className="bg-zinc-50 min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-16">
        <Outlet />
      </div>
    </main>
  );
}
