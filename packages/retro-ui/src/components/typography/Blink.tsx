import type { CSSProperties, ElementType } from 'react';

import type { PolymorphicProps } from '../../types';
import { cx } from '../../utils/cx';

export interface BlinkOwnProps {
  /** One full on/off cycle, in seconds. */
  speed?: number;
}

/**
 * Blinking text — the `<blink>` element's spiritual successor.
 *
 * The resting (un-animated) state is fully visible, so text stays readable
 * when the reduced-motion policy strips the animation. The original's
 * keyframes ended at `opacity: 0`, which meant killing the animation left the
 * text permanently invisible.
 */
export function Blink<TElement extends ElementType = 'span'>({
  as,
  speed = 1,
  className,
  style,
  children,
  ...rest
}: PolymorphicProps<TElement, BlinkOwnProps>) {
  const Component = (as ?? 'span') as ElementType;
  return (
    <Component
      className={cx('retro-blink', className)}
      style={
        { '--retro-blink-speed': `${speed}s`, ...style } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Component>
  );
}
