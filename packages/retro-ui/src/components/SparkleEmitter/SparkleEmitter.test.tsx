import { render, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SparkleEmitter } from './SparkleEmitter';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const countSparkles = (container: HTMLElement) =>
  container.querySelectorAll('.retro-sparkle').length;

describe('SparkleEmitter', () => {
  it('emits at the requested rate rather than compounding', () => {
    const { container } = render(
      <SparkleEmitter interval={1000} initialBurst={0} lifetime={100000} />,
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Five ticks of a 1s interval is five sparkles. The original implementation
    // took a fresh array literal as its default `characters` prop, so every
    // emission re-rendered, re-created the emit callback, re-ran the scheduling
    // effect and emitted again — hundreds of sparkles within a second.
    expect(countSparkles(container)).toBe(5);
  });

  it('stays bounded when the caller passes a new array on every render', () => {
    function Wrapper() {
      // Exactly the shape that triggered the runaway: an inline literal, which
      // has a different identity on each render.
      return (
        <SparkleEmitter
          interval={1000}
          initialBurst={0}
          lifetime={100000}
          characters={['✨', '⭐']}
        />
      );
    }

    const { container } = render(<Wrapper />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(countSparkles(container)).toBe(3);
  });

  it('retires each sparkle after its lifetime', () => {
    const { container } = render(
      <SparkleEmitter interval={1000} initialBurst={0} lifetime={2000} />,
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(countSparkles(container)).toBe(1);

    // By t=3000 three have been emitted (t=1000, 2000, 3000) and the first has
    // reached the end of its 2000ms lifetime, leaving two on screen.
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(countSparkles(container)).toBe(2);

    // Emission and expiry stay in step rather than accumulating.
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(countSparkles(container)).toBe(2);
  });

  it('emits nothing at all when disabled', () => {
    const { container } = render(
      <SparkleEmitter enabled={false} interval={100} initialBurst={5} />,
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(countSparkles(container)).toBe(0);
  });

  it('clears its pending expiry timers on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = render(
      <SparkleEmitter interval={500} initialBurst={0} lifetime={100000} />,
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    clearSpy.mockClear();
    unmount();

    // Four in-flight expiry timers, plus the burst timers.
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
