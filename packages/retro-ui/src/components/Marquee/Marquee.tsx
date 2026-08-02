import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';

export type MarqueeBehavior = 'scroll' | 'alternate' | 'slide';
export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';

export interface MarqueeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onScroll'> {
  behavior?: MarqueeBehavior;
  direction?: MarqueeDirection;
  /**
   * Pixels travelled per tick, matching the original attribute's scale — the
   * real element moved `scrollAmount` pixels every `scrollDelay` milliseconds.
   */
  scrollAmount?: number;
  /** Milliseconds between ticks. The element's own default was 85. */
  scrollDelay?: number;
  /** Repetitions, or `'infinite'`. */
  loop?: number | 'infinite';
  /**
   * Pause while hovered or focused. On by default: WCAG 2.2.2 requires a way
   * to stop motion that starts automatically and runs for more than five
   * seconds, which describes every marquee ever written.
   */
  pauseOnHover?: boolean;
  /** Pause programmatically. */
  paused?: boolean;
}

const PX_PER_TICK_DEFAULT = 6;
const TICK_MS_DEFAULT = 85;

/**
 * A replacement for the deprecated `<marquee>` element.
 *
 * `<marquee>` is obsolete — it was removed from the HTML standard and browsers
 * are free to drop it — so the kit reimplements the behaviours people actually
 * used on top of CSS transforms. Two things the original element never did:
 * it reflows when the container or content resizes, and it can be paused.
 */
export function Marquee({
  behavior = 'scroll',
  direction = 'left',
  scrollAmount = PX_PER_TICK_DEFAULT,
  scrollDelay = TICK_MS_DEFAULT,
  loop = 'infinite',
  pauseOnHover = true,
  paused = false,
  className,
  style,
  children,
  ...rest
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  const [metrics, setMetrics] = useState({ container: 0, track: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const vertical = direction === 'up' || direction === 'down';
    setMetrics({
      container: vertical ? container.offsetHeight : container.offsetWidth,
      track: vertical ? track.offsetHeight : track.offsetWidth,
    });
  }, [direction]);

  useLayoutEffect(measure, [measure, children]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure]);

  // With motion suppressed the content still has to be readable, so the track
  // stops moving and wraps in place rather than sitting off-screen.
  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className={cx('retro-marquee', 'retro-marquee--static', className)}
        style={style}
        {...rest}
      >
        <span ref={trackRef} className="retro-marquee__track">
          {children}
        </span>
      </div>
    );
  }

  const { container, track } = metrics;
  const vertical = direction === 'up' || direction === 'down';
  const forward = direction === 'left' || direction === 'up';

  let fromOffset: number;
  let toOffset: number;
  let distance: number;

  if (behavior === 'alternate') {
    // Bounce between the two edges. When the content is wider than its
    // container the span is negative, which is what makes long text sweep
    // back and forth instead of sitting still.
    const span = container - track;
    fromOffset = 0;
    toOffset = span;
    distance = Math.abs(span);
  } else if (behavior === 'slide') {
    // Enter from one edge and stop flush against the other.
    fromOffset = forward ? container : -track;
    toOffset = 0;
    distance = Math.abs(fromOffset);
  } else {
    // Classic scroll: fully off one edge, fully off the other.
    fromOffset = forward ? container : -track;
    toOffset = forward ? -track : container;
    distance = container + track;
  }

  const pixelsPerSecond = (scrollAmount * 1000) / Math.max(1, scrollDelay);
  const duration = distance > 0 ? distance / pixelsPerSecond : 0;

  const axis = vertical ? 'y' : 'x';
  const other = vertical ? 'x' : 'y';

  const trackStyle = {
    [`--retro-marquee-from-${axis}`]: `${fromOffset}px`,
    [`--retro-marquee-to-${axis}`]: `${toOffset}px`,
    [`--retro-marquee-from-${other}`]: '0px',
    [`--retro-marquee-to-${other}`]: '0px',
    '--retro-marquee-duration': `${duration.toFixed(3)}s`,
    '--retro-marquee-name':
      behavior === 'alternate' ? 'retro-marquee-alternate' : 'retro-marquee-scroll',
    '--retro-marquee-iterations':
      behavior === 'slide' ? 1 : loop === 'infinite' ? 'infinite' : loop,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={cx(
        'retro-marquee',
        behavior === 'alternate' && 'retro-marquee--alternate',
        pauseOnHover && 'retro-marquee--pause-on-hover',
        paused && 'retro-marquee--paused',
        // A zero duration would fill straight to the end state, hiding the
        // content until the first measurement lands.
        duration === 0 && 'retro-marquee--measuring',
        className,
      )}
      style={style}
      {...rest}
    >
      <span ref={trackRef} className="retro-marquee__track" style={trackStyle}>
        {children}
      </span>
    </div>
  );
}
