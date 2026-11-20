import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatCount, useVisitorCounter } from './useVisitorCounter';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('formatCount', () => {
  it('zero-pads to the requested width', () => {
    expect(formatCount(42)).toBe('000042');
    expect(formatCount(42, 8)).toBe('00000042');
  });

  it('never renders a negative or fractional counter', () => {
    expect(formatCount(-5)).toBe('000000');
    expect(formatCount(12.7)).toBe('000012');
  });
});

describe('useVisitorCounter', () => {
  it('fetches and formats the count', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ count: 1337 }),
      }),
    );

    const { result } = renderHook(() => useVisitorCounter());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.count).toBe(1337);
    expect(result.current.formatted).toBe('001337');
  });

  it('falls back rather than showing a broken counter', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const { result } = renderHook(() => useVisitorCounter({ fallback: 123456 }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.formatted).toBe('123456');
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('treats a non-numeric count as a failure instead of rendering NaN', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ count: 'lots' }),
      }),
    );

    const { result } = renderHook(() => useVisitorCounter({ fallback: 999 }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.formatted).toBe('000999');
  });
});
