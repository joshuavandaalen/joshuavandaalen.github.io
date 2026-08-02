import type { ElementType } from 'react';

import type { PolymorphicProps } from '../../types';
import { cx } from '../../utils/cx';

export interface GlowingTitleOwnProps {
  /** Pulse the glow. */
  pulse?: boolean;
}

/** The five-layer neon page title. */
export function GlowingTitle<TElement extends ElementType = 'h1'>({
  as,
  pulse = true,
  className,
  children,
  ...rest
}: PolymorphicProps<TElement, GlowingTitleOwnProps>) {
  const Component = (as ?? 'h1') as ElementType;
  return (
    <Component
      className={cx(
        'retro-glowing-title',
        pulse && 'retro-glowing-title--pulse',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
