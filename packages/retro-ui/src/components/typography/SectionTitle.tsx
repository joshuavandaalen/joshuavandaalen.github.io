import type { ElementType } from 'react';

import type { PolymorphicProps } from '../../types';
import { cx } from '../../utils/cx';

/** Magenta heading with the hard yellow-and-black offset shadow. */
export function SectionTitle<TElement extends ElementType = 'h2'>({
  as,
  className,
  children,
  ...rest
}: PolymorphicProps<TElement>) {
  const Component = (as ?? 'h2') as ElementType;
  return (
    <Component className={cx('retro-section-title', className)} {...rest}>
      {children}
    </Component>
  );
}
