// Runs before first paint so a stored choice never flashes the wrong theme.
export const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`;

function toggle() {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const system = systemDark ? 'dark' : 'light';
  const current = root.dataset.theme ?? system;
  const next = current === 'dark' ? 'light' : 'dark';

  // Fade the swap, but only for its duration.
  root.setAttribute('data-theme-switching', '');
  window.setTimeout(() => root.removeAttribute('data-theme-switching'), 200);

  try {
    if (next === system) {
      // Back in step with the OS, so stop overriding it.
      root.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      root.dataset.theme = next;
      localStorage.setItem('theme', next);
    }
  } catch (error) {
    // Storage can be blocked; the theme still applies for this page.
    root.dataset.theme = next;
  }
}

// A contrast mark that is its own state: the filled half swaps sides on
// switch. Driven by CSS rather than React state, so the server renders the
// correct orientation and there is nothing to hydrate.
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between the light and dark theme"
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink focus-visible:text-ink focus-visible:outline-none focus-visible:underline underline-offset-4 transition-colors"
    >
      Theme
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-[1.05em] w-[1.05em] rotate-0 dark:rotate-180 transition-transform duration-300 motion-reduce:transition-none"
      >
        <circle
          cx="8"
          cy="8"
          r="7.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path d="M8 0.75 A7.25 7.25 0 0 0 8 15.25 Z" fill="currentColor" />
      </svg>
    </button>
  );
}
