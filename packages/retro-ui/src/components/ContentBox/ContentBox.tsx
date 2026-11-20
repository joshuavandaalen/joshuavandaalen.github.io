import type { ElementType } from 'react';

import type { PolymorphicProps } from '../../types';
import { cx } from '../../utils/cx';

export type ContentBoxVariant = 'default' | 'highlight' | 'gold';

export interface ContentBoxOwnProps {
  variant?: ContentBoxVariant;
  /** The blurred rainbow bleed behind the panel edge. */
  halo?: boolean;
  /** Slow breathing scale. */
  pulse?: boolean;
}

/** The bevelled gradient panel that holds every section of the page. */
export function ContentBox<TElement extends ElementType = 'section'>({
  as,
  variant = 'default',
  halo = true,
  pulse = false,
  className,
  children,
  ...rest
}: PolymorphicProps<TElement, ContentBoxOwnProps>) {
  const Component = (as ?? 'section') as ElementType;
  return (
    <Component
      className={cx(
        'retro-content-box',
        variant !== 'default' && `retro-content-box--${variant}`,
        halo && 'retro-content-box--halo',
        pulse && 'retro-content-box--pulse',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
