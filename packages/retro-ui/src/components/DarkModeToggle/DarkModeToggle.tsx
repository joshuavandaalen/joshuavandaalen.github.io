import { useCallback, useEffect, useState, type HTMLAttributes } from 'react';

import type { RetroTheme } from '../../types';
import { Win95Button } from '../Window95/Window95';
import { cx } from '../../utils/cx';

export interface DarkModeToggleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** localStorage key. */
  storageKey?: string;
  /** Theme used before anything is stored. */
  defaultTheme?: RetroTheme;
  onChange?: (theme: RetroTheme) => void;
  label?: string;
  /** Fixed top-right (default) or inline. */
  position?: 'fixed' | 'static';
}

function readStored(key: string, fallback: RetroTheme): RetroTheme {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored === 'light' || stored === 'dark' ? stored : fallback;
  } catch {
    // Private browsing and blocked storage both throw here.
    return fallback;
  }
}

/**
 * Theme switcher in a Windows chrome widget.
 *
 * Two fixes over the original. Its button label was inverted — dark was the
 * default, yet the button read "☀️ LIGHT" while already dark, so it described
 * the current state in one place and the destination in another. And it
 * applied the theme by injecting fifty `!important` declarations at runtime;
 * this flips one `data-retro-theme` attribute that the token layer reads,
 * so consumer overrides still win.
 */
export function DarkModeToggle({
  storageKey = 'retro-ui-theme',
  defaultTheme = 'dark',
  onChange,
  label = 'MODE:',
  position = 'fixed',
  className,
  ...rest
}: DarkModeToggleProps) {
  const [theme, setTheme] = useState<RetroTheme>(defaultTheme);

  // Read storage after mount, never during render: the server has no
  // localStorage, and reading it while rendering causes a hydration mismatch.
  useEffect(() => {
    setTheme(readStored(storageKey, defaultTheme));
  }, [storageKey, defaultTheme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-retro-theme', theme);
  }, [theme]);

  const handleToggle = useCallback(() => {
    setTheme((current) => {
      const next: RetroTheme = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage unavailable — the toggle still works for this session.
      }
      onChange?.(next);
      return next;
    });
  }, [storageKey, onChange]);

  // The label names where the button will take you, which is what a button
  // label should do.
  const destination = theme === 'dark' ? '☀️ LIGHT' : '🌙 DARK';

  return (
    <div
      className={cx(
        'retro-darkmode-toggle',
        position === 'static' && 'retro-darkmode-toggle--static',
        className,
      )}
      {...rest}
    >
      <span className="retro-darkmode-toggle__label">{label}</span>
      <Win95Button
        onClick={handleToggle}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {destination}
      </Win95Button>
    </div>
  );
}
