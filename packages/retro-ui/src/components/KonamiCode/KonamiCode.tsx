import { useEffect, useRef, useState, type ReactNode } from 'react';

import { useKonamiCode } from '../../hooks/useKonamiCode';
import { SparkleEmitter } from '../SparkleEmitter/SparkleEmitter';

export interface KonamiCodeProps {
  onActivate?: () => void;
  children?: ReactNode;
}

/**
 * Listens for ↑ ↑ ↓ ↓ ← → ← → B A and renders `children` once it fires.
 *
 * Declarative wrapper around `useKonamiCode` for when the payoff is markup
 * rather than a side effect.
 */
export function KonamiCode({ onActivate, children }: KonamiCodeProps) {
  const [activated, setActivated] = useState(false);

  useKonamiCode(() => {
    setActivated(true);
    onActivate?.();
  });

  return activated ? <>{children}</> : null;
}

export interface Maximum90sModeProps {
  /** Seconds before the chaos subsides. Omit to leave it running. */
  duration?: number;
  onEnd?: () => void;
}

/**
 * Peak 1997: fifty sparkles and Comic Sans applied to everything.
 *
 * The original also set `animation: blink` on a random 30% of every element on
 * the page — including, potentially, the elements you needed to read to leave.
 * This keeps the sparkles and the font crime, and drops the part that made the
 * page unusable.
 */
export function Maximum90sMode({ duration, onEnd }: Maximum90sModeProps) {
  const [active, setActive] = useState(true);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      setActive(false);
      onEndRef.current?.();
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!active) return null;

  return (
    <>
      <style>{`.retro-root { font-family: var(--retro-font-display) !important; }`}</style>
      <SparkleEmitter interval={100} initialBurst={50} />
    </>
  );
}
