import { useEffect, useRef } from 'react';

/** ↑ ↑ ↓ ↓ ← → ← → B A */
export const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

export interface UseKonamiCodeOptions {
  /** Override the sequence. Defaults to the canonical Contra code. */
  sequence?: readonly string[];
  /** Set false to stop listening without unmounting the caller. */
  enabled?: boolean;
}

/**
 * Fires `onActivate` when the sequence is typed.
 *
 * Comparison is case-insensitive, which the original's was not — it checked
 * `e.key` against lowercase `'b'`/`'a'`, so the code silently failed for
 * anyone with caps lock on.
 */
export function useKonamiCode(
  onActivate: () => void,
  { sequence = KONAMI_SEQUENCE, enabled = true }: UseKonamiCodeOptions = {},
): void {
  const buffer = useRef<string[]>([]);
  const callback = useRef(onActivate);
  callback.current = onActivate;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const normalised = sequence.map((key) => key.toLowerCase());

    const onKeyDown = (event: KeyboardEvent) => {
      buffer.current = [
        ...buffer.current,
        event.key.toLowerCase(),
      ].slice(-normalised.length);

      if (buffer.current.join(',') === normalised.join(',')) {
        buffer.current = [];
        callback.current();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, sequence]);
}
