import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { formatCount } from '../../hooks/useVisitorCounter';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';

export interface VisitorCounterProps extends HTMLAttributes<HTMLDivElement> {
  /** The number to display. Pair with `useVisitorCounter` to fetch one. */
  count: number;
  /** Digits to zero-pad to. */
  digits?: number;
  /** Text before the number. */
  label?: ReactNode;
  /** Blinking glyph at both ends. */
  icon?: ReactNode;
  /** Flip the digits when the value changes. */
  spinOnChange?: boolean;
}

/**
 * The hit counter. Black panel, green bevel, red Courier digits.
 *
 * The number is wrapped in an `aria-live="polite"` region so a change is
 * announced once, rather than the screen reader re-reading six digits every
 * time one of them ticks over.
 */
export function VisitorCounter({
  count,
  digits = 6,
  label = 'You are visitor number:',
  icon = '👁️',
  spinOnChange = true,
  className,
  ...rest
}: VisitorCounterProps) {
  const reducedMotion = useReducedMotion();
  const [spinning, setSpinning] = useState(false);
  const previous = useRef(count);

  useEffect(() => {
    if (previous.current === count) return;
    previous.current = count;

    if (!spinOnChange || reducedMotion) return;

    setSpinning(true);
    const timer = setTimeout(() => setSpinning(false), 500);
    return () => clearTimeout(timer);
  }, [count, spinOnChange, reducedMotion]);

  const formatted = formatCount(count, digits);

  return (
    <div className={cx('retro-visitor-counter', className)} {...rest}>
      <span className="retro-visitor-counter__icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        {label}{' '}
        <span
          // `key` forces a fresh element so the animation replays on every
          // change; restarting a CSS animation on the same node otherwise
          // requires a reflow hack.
          key={spinning ? formatted : undefined}
          className={cx(
            'retro-visitor-counter__display',
            spinning && 'retro-visitor-counter__display--spin',
          )}
          aria-live="polite"
        >
          {formatted}
        </span>
      </span>
      <span className="retro-visitor-counter__icon" aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}
