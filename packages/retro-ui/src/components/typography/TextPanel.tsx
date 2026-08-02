import type { ElementType } from 'react';

import type { PolymorphicProps } from '../../types';
import { cx } from '../../utils/cx';

export type TextPanelVariant = 'intro' | 'fun' | 'note';

export interface TextPanelOwnProps {
  /**
   * `intro` — the large translucent body panel.
   * `fun`   — the dashed-border aside.
   * `note`  — the small italic centred caveat.
   */
  variant?: TextPanelVariant;
}

/** Translucent white panel that keeps dark text legible over the starfield. */
export function TextPanel<TElement extends ElementType = 'p'>({
  as,
  variant = 'intro',
  className,
  children,
  ...rest
}: PolymorphicProps<TElement, TextPanelOwnProps>) {
  const Component = (as ?? 'p') as ElementType;
  return (
    <Component
      className={cx('retro-text-panel', `retro-text-panel--${variant}`, className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
