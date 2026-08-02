import type { ElementType } from 'react';

import type { PolymorphicProps } from '../../types';
import { cx } from '../../utils/cx';

export type CoolButtonVariant = 'fire' | 'gold' | 'diamond' | 'grass';
export type CoolButtonSize = 'sm' | 'md' | 'lg';

export interface CoolButtonOwnProps {
  variant?: CoolButtonVariant;
  size?: CoolButtonSize;
  /** Bob gently up and down. */
  float?: boolean;
  disabled?: boolean;
  /**
   * Supplying an href renders an `<a>` instead of a `<button>`.
   *
   * Declared here rather than left to the element's own props so that
   * `<CoolButton href="…">` type-checks without an explicit `as="a"` — the
   * component picks the element, so the type has to allow the prop that
   * triggers the choice.
   */
  href?: string;
}

/**
 * The tilted, bevelled, floating call-to-action button.
 *
 * Polymorphic because the original used the same visual for both links and
 * actions. Rendering an `<a>` when there is an `href` and a `<button>`
 * otherwise keeps keyboard behaviour correct — the original's web-ring
 * controls were `<a href="#">`, which navigate rather than act.
 */
export function CoolButton<TElement extends ElementType = 'button'>({
  as,
  variant = 'fire',
  size = 'md',
  float = false,
  disabled = false,
  className,
  children,
  ...rest
}: PolymorphicProps<TElement, CoolButtonOwnProps>) {
  const hasHref = 'href' in (rest as Record<string, unknown>);
  const Component = (as ?? (hasHref ? 'a' : 'button')) as ElementType;
  const isNativeButton = Component === 'button';

  return (
    <Component
      className={cx(
        'retro-cool-button',
        variant !== 'fire' && `retro-cool-button--${variant}`,
        size !== 'md' && `retro-cool-button--${size}`,
        float && !disabled && 'retro-cool-button--float',
        className,
      )}
      // A disabled `<a>` is not a thing, so non-buttons communicate the state
      // through ARIA instead of a silently-ignored `disabled` attribute.
      {...(isNativeButton
        ? { disabled, type: (rest as { type?: string }).type ?? 'button' }
        : { 'aria-disabled': disabled || undefined })}
      {...rest}
    >
      {children}
    </Component>
  );
}
