import { useCallback, useEffect, useRef, useState } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface SparkleEmitterProps {
  /** Milliseconds between sparkles. */
  interval?: number;
  /** Glyphs chosen from at random. */
  characters?: string[];
  /** Sparkles emitted immediately on mount. */
  initialBurst?: number;
  /** Milliseconds each sparkle lives. Must match the CSS animation. */
  lifetime?: number;
  enabled?: boolean;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  character: string;
}

/**
 * Hoisted to module scope on purpose.
 *
 * As an inline default this array was rebuilt on every render, which changed
 * the identity of the emit callback, which re-ran the effect that schedules
 * emissions, which set state, which rendered again — a feedback loop that
 * buried the page in sparkles within a second.
 */
const DEFAULT_CHARACTERS = ['✨', '⭐', '💫', '🌟'];

/**
 * Emits sparkles at random points on screen.
 *
 * The original appended a `<div>` to `document.body` on a bare `setInterval`
 * with no cleanup, so navigating away left the timer running for the life of
 * the tab. This unmounts cleanly and stops entirely under reduced motion.
 */
export function SparkleEmitter({
  interval = 3000,
  characters = DEFAULT_CHARACTERS,
  initialBurst = 3,
  lifetime = 2000,
  enabled = true,
}: SparkleEmitterProps) {
  const reducedMotion = useReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const nextId = useRef(0);
  const timeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const active = enabled && !reducedMotion;

  // Held in a ref so `emit` keeps a stable identity even when a caller passes
  // a fresh array on every render — which is the normal way to pass a literal.
  const settings = useRef({ characters, lifetime });
  settings.current = { characters, lifetime };

  const emit = useCallback(() => {
    const { characters: glyphs, lifetime: ttl } = settings.current;
    const id = nextId.current++;

    setSparkles((current) => [
      ...current,
      {
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        character: glyphs[Math.floor(Math.random() * glyphs.length)] ?? '✨',
      },
    ]);

    const timer = setTimeout(() => {
      timeouts.current.delete(timer);
      setSparkles((current) => current.filter((sparkle) => sparkle.id !== id));
    }, ttl);
    timeouts.current.add(timer);
  }, []);

  useEffect(() => {
    if (!active) {
      setSparkles([]);
      return;
    }

    const bursts = Array.from({ length: initialBurst }, (_, index) =>
      setTimeout(emit, index * 500),
    );
    const timer = setInterval(emit, interval);

    return () => {
      bursts.forEach(clearTimeout);
      clearInterval(timer);
    };
  }, [active, emit, interval, initialBurst]);

  // Expiry timers outlive the interval, so they get their own unmount sweep.
  useEffect(
    () => () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current.clear();
    },
    [],
  );

  if (!active) return null;

  return (
    <div className="retro-sparkle-layer" aria-hidden="true">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="retro-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: `${sparkle.size}px`,
          }}
        >
          {sparkle.character}
        </span>
      ))}
    </div>
  );
}
