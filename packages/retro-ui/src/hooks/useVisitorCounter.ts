import { useCallback, useEffect, useState } from 'react';

export interface UseVisitorCounterOptions {
  /** Endpoint returning `{ count: number }`. */
  endpoint?: string;
  /** Digits to zero-pad to. Six is the GeoCities standard. */
  digits?: number;
  /**
   * Shown when the request fails. The original hard-coded `123456`, which is
   * both a lie and, frankly, the correct choice for a visitor counter.
   */
  fallback?: number;
  /** Set false to skip fetching — useful when passing a `count` in directly. */
  enabled?: boolean;
}

export interface VisitorCounterState {
  /** Raw count, or null before the first response. */
  count: number | null;
  /** Zero-padded string ready for display. */
  formatted: string;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Fetches and formats a server-side visitor count.
 *
 * Ported from the original's inline `fetch`, with the parts that were missing:
 * an abort on unmount, a typed error branch, and a guard against a malformed
 * response setting the counter to `NaN`.
 */
export function useVisitorCounter({
  endpoint = '/api/visitors',
  digits = 6,
  fallback = 123456,
  enabled = true,
}: UseVisitorCounterOptions = {}): VisitorCounterState {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    fetch(endpoint, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Visitor counter responded ${response.status}`);
        }
        return response.json() as Promise<{ count?: unknown }>;
      })
      .then((data) => {
        if (cancelled) return;
        const value = Number(data?.count);
        if (!Number.isFinite(value)) {
          throw new Error('Visitor counter returned a non-numeric count');
        }
        setCount(value);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled || (cause as Error)?.name === 'AbortError') return;
        setCount(fallback);
        setError(cause instanceof Error ? cause : new Error(String(cause)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [endpoint, fallback, enabled, nonce]);

  return {
    count,
    formatted: formatCount(count ?? 0, digits),
    loading,
    error,
    refresh,
  };
}

/** Zero-pads a count for the seven-segment look. */
export function formatCount(count: number, digits = 6): string {
  return Math.max(0, Math.floor(count)).toString().padStart(digits, '0');
}
