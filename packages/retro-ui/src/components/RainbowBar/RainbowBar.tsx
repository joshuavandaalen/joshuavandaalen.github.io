import type { CSSProperties, HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

export interface RainbowBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Bar thickness in pixels. */
  height?: number;
  /** Seconds for one full sweep of the gradient. */
  speed?: number;
  /** Override the ramp. Any number of stops works. */
  colors?: string[];
}

/** The animated seven-stop rainbow divider. Purely decorative, so aria-hidden. */
export function RainbowBar({
  height = 10,
  speed = 3,
  colors,
  className,
  style,
  ...rest
}: RainbowBarProps) {
  return (
    <div
      aria-hidden="true"
      className={cx('retro-rainbow-bar', className)}
      style={
        {
          '--retro-rainbow-bar-height': `${height}px`,
          '--retro-rainbow-bar-speed': `${speed}s`,
          ...(colors
            ? { background: `linear-gradient(90deg, ${colors.join(', ')})`, backgroundSize: '200% 100%' }
            : {}),
          ...style,
        } as CSSProperties
      }
      {...rest}
    />
  );
}
