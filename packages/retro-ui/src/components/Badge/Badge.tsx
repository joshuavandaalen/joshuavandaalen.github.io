import type { HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

export type BadgeVariant = 'gold' | 'silver' | 'dark';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/** Bevelled award chip — "GeoCities Certified™", "HTML 4.0!", and so on. */
export function Badge({
  variant = 'gold',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx(
        'retro-badge',
        variant !== 'gold' && `retro-badge--${variant}`,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export interface BadgeRowProps extends HTMLAttributes<HTMLDivElement> {}

/** Centred, wrapping row of badges. */
export function BadgeRow({ className, children, ...rest }: BadgeRowProps) {
  return (
    <div className={cx('retro-badges', className)} {...rest}>
      {children}
    </div>
  );
}
