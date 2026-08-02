import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

import type { RetroTheme } from '../types';

export interface RetroContextValue {
  /**
   * When true, animations run even for visitors who have asked their OS to
   * reduce motion. Off by default: the kit is a real library, and a novelty
   * aesthetic is not a good enough reason to make someone nauseous.
   */
  forceMotion: boolean;
  theme: RetroTheme;
}

const RetroContext = createContext<RetroContextValue>({
  forceMotion: false,
  theme: 'dark',
});

export interface RetroProviderProps {
  children: ReactNode;
  /** Opt every animation back in regardless of `prefers-reduced-motion`. */
  forceMotion?: boolean;
  /** `dark` is the navy-starfield house style; `light` is the Notepad look. */
  theme?: RetroTheme;
  /**
   * Where the theme and force-motion attributes are written. Defaults to the
   * document element so the reduced-motion policy — which is scoped to
   * `:root` — can see them.
   */
  target?: 'documentElement' | 'none';
}

/**
 * Supplies theme and motion policy to the kit.
 *
 * Optional: every component works standalone with sensible defaults. Wrap the
 * app when you want light mode or `forceMotion`.
 */
export function RetroProvider({
  children,
  forceMotion = false,
  theme = 'dark',
  target = 'documentElement',
}: RetroProviderProps) {
  useEffect(() => {
    if (target === 'none' || typeof document === 'undefined') return;

    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-retro-theme');
    const hadForceMotion = root.hasAttribute('data-retro-force-motion');

    root.setAttribute('data-retro-theme', theme);
    if (forceMotion) {
      root.setAttribute('data-retro-force-motion', '');
    } else {
      root.removeAttribute('data-retro-force-motion');
    }

    return () => {
      if (previousTheme === null) {
        root.removeAttribute('data-retro-theme');
      } else {
        root.setAttribute('data-retro-theme', previousTheme);
      }
      if (hadForceMotion) {
        root.setAttribute('data-retro-force-motion', '');
      } else {
        root.removeAttribute('data-retro-force-motion');
      }
    };
  }, [forceMotion, theme, target]);

  const value = useMemo<RetroContextValue>(
    () => ({ forceMotion, theme }),
    [forceMotion, theme],
  );

  return <RetroContext.Provider value={value}>{children}</RetroContext.Provider>;
}

/** Read the current theme and motion policy. Safe to call outside a provider. */
export function useRetroContext(): RetroContextValue {
  return useContext(RetroContext);
}
