import { useEffect, useMemo, useRef } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface UnicornCursorProps {
  /** The creature itself. Any emoji works. */
  emoji?: string;
  /** Number of trail dots. */
  trailLength?: number;
  /** Trail colours, cycled. */
  colors?: string[];
  /**
   * Follow easing, 0–1. Lower is laggier and more magical; 1 pins it to the
   * pointer exactly.
   */
  easing?: number;
  enabled?: boolean;
}

const RAINBOW = [
  '#ff0000',
  '#ff8800',
  '#ffff00',
  '#00ff00',
  '#0088ff',
  '#8800ff',
  '#ff00ff',
];

/**
 * A unicorn that chases the pointer, trailing rainbow dots.
 *
 * Positions are written straight to the DOM inside a `requestAnimationFrame`
 * loop rather than through React state — twenty-one elements re-rendering at
 * 60fps would mean 1,260 reconciliations a second for something purely
 * decorative.
 */
export function UnicornCursor({
  emoji = '🦄',
  trailLength = 20,
  colors = RAINBOW,
  easing = 0.12,
  enabled = true,
}: UnicornCursorProps) {
  const reducedMotion = useReducedMotion();
  const unicornRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);

  const active = enabled && !reducedMotion;

  const dots = useMemo(
    () =>
      Array.from({ length: trailLength }, (_, index) => ({
        color: colors[index % colors.length] ?? '#ff00ff',
        size: Math.max(4, 14 - index),
        opacity: Number((1 - index / trailLength).toFixed(2)),
      })),
    [trailLength, colors],
  );

  useEffect(() => {
    if (!active || typeof window === 'undefined') return;

    let pointerX = -100;
    let pointerY = -100;
    let x = -100;
    let y = -100;
    let frame = 0;

    const trail = Array.from({ length: trailLength }, () => ({
      x: -100,
      y: -100,
    }));

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const step = () => {
      x += (pointerX - x) * easing;
      y += (pointerY - y) * easing;

      const unicorn = unicornRef.current;
      if (unicorn) {
        // Flip to face the direction of travel.
        unicorn.style.transform =
          pointerX - x < -1 ? 'scaleX(-1)' : 'scaleX(1)';
        unicorn.style.left = `${x + 10}px`;
        unicorn.style.top = `${y - 20}px`;
      }

      for (let i = trail.length - 1; i > 0; i -= 1) {
        const previous = trail[i - 1];
        const current = trail[i];
        if (previous && current) {
          current.x = previous.x;
          current.y = previous.y;
        }
      }
      const head = trail[0];
      if (head) {
        head.x = x;
        head.y = y;
      }

      trail.forEach((point, index) => {
        const element = dotRefs.current[index];
        if (!element) return;
        element.style.left = `${point.x}px`;
        element.style.top = `${point.y}px`;
      });

      frame = requestAnimationFrame(step);
    };

    window.addEventListener('pointermove', onPointerMove);
    frame = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [active, easing, trailLength]);

  if (!active) return null;

  return (
    <div aria-hidden="true">
      {dots.map((dot, index) => (
        <div
          key={index}
          ref={(element) => {
            dotRefs.current[index] = element;
          }}
          className="retro-unicorn-trail-dot"
          style={{
            background: dot.color,
            color: dot.color,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
          }}
        />
      ))}
      <div ref={unicornRef} className="retro-unicorn">
        {emoji}
      </div>
    </div>
  );
}
