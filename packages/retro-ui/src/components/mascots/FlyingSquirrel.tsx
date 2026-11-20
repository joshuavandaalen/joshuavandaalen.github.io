import type { CSSProperties, HTMLAttributes } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';

export interface FlyingSquirrelProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds for one crossing. */
  duration?: number;
  /** Height of the strip it glides through, in pixels. */
  trackHeight?: number;
  /** Freeze it mid-flight. */
  paused?: boolean;
}

/**
 * A flying squirrel, gliding across the top of the page forever.
 *
 * Fourteen divs, no images: head, two ears, eye, nose, torso, two membrane
 * wings, two paws, tail and a ground shadow. Purely decorative, so it is
 * hidden from assistive technology and does not render at all under
 * reduced motion.
 */
export function FlyingSquirrel({
  duration = 8,
  trackHeight = 80,
  paused = false,
  className,
  style,
  ...rest
}: FlyingSquirrelProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={cx('retro-squirrel-track', className)}
      style={{ height: `${trackHeight}px`, ...style }}
      {...rest}
    >
      <div
        className="retro-squirrel"
        style={
          {
            '--retro-squirrel-duration': `${duration}s`,
            animationPlayState: paused ? 'paused' : undefined,
          } as CSSProperties
        }
      >
        <div className="retro-squirrel__tail" />
        <div className="retro-squirrel__body">
          <div className="retro-squirrel__ear retro-squirrel__ear--left" />
          <div className="retro-squirrel__ear retro-squirrel__ear--right" />
          <div className="retro-squirrel__head">
            <div className="retro-squirrel__eye" />
            <div className="retro-squirrel__nose" />
          </div>
          <div className="retro-squirrel__torso" />
          <div className="retro-squirrel__wing retro-squirrel__wing--top" />
          <div className="retro-squirrel__wing retro-squirrel__wing--bottom" />
          <div className="retro-squirrel__paw retro-squirrel__paw--front" />
          <div className="retro-squirrel__paw retro-squirrel__paw--back" />
        </div>
        <div className="retro-squirrel__shadow" />
      </div>
    </div>
  );
}
