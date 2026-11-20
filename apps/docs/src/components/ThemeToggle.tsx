import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'retro-docs-theme';

function readStored(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

/**
 * Docs-site theme switch, entirely separate from the kit's own retro theming.
 *
 * Three states, not two: an explicit choice sets `data-docs-theme`, while
 * `system` removes the attribute so `prefers-color-scheme` governs — which is
 * what someone who never touches the control actually wants.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => setTheme(readStored()), []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-docs-theme');
    else root.setAttribute('data-docs-theme', theme);
  }, [theme]);

  const cycle = useCallback(() => {
    setTheme((current) => {
      const next: Theme =
        current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
      try {
        if (next === 'system') window.localStorage.removeItem(STORAGE_KEY);
        else window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage blocked; the choice still applies for this session.
      }
      return next;
    });
  }, []);

  const icon = theme === 'light' ? '☀' : theme === 'dark' ? '☾' : '◐';
  const name = theme === 'system' ? 'system' : theme;

  return (
    <button
      type="button"
      className="docs-icon-button"
      onClick={cycle}
      aria-label={`Colour theme: ${name}. Activate to change.`}
      title={`Theme: ${name}`}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
