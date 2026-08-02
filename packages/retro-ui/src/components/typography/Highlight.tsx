import type { HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

/** Yellow-on-red inline emphasis chip. Renders a `<mark>`, which is what it is. */
export function Highlight({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <mark className={cx('retro-highlight', className)} {...rest}>
      {children}
    </mark>
  );
}
