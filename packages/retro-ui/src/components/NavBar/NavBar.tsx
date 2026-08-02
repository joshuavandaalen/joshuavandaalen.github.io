import type { ElementType, HTMLAttributes } from 'react';

import type { PolymorphicProps } from '../../types';
import { cx } from '../../utils/cx';

export interface NavBarProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the landmark. */
  label?: string;
}

/** Row of chunky bevelled navigation buttons. */
export function NavBar({ label = 'Main', className, children, ...rest }: NavBarProps) {
  return (
    <nav aria-label={label} className={cx('retro-nav-bar', className)} {...rest}>
      {children}
    </nav>
  );
}

export interface NavButtonOwnProps {
  /** Marks the current page — also sets `aria-current`. */
  active?: boolean;
  disabled?: boolean;
  /** Supplying an href renders an `<a>` instead of a `<button>`. */
  href?: string;
}

/** A single nav button. Renders `<a>` with an `href`, `<button>` without. */
export function NavButton<TElement extends ElementType = 'a'>({
  as,
  active = false,
  disabled = false,
  className,
  children,
  ...rest
}: PolymorphicProps<TElement, NavButtonOwnProps>) {
  const hasHref = 'href' in (rest as Record<string, unknown>);
  const Component = (as ?? (hasHref ? 'a' : 'button')) as ElementType;
  const isNativeButton = Component === 'button';

  return (
    <Component
      className={cx(
        'retro-nav-button',
        active && 'retro-nav-button--active',
        className,
      )}
      aria-current={active ? 'page' : undefined}
      {...(isNativeButton
        ? { disabled, type: (rest as { type?: string }).type ?? 'button' }
        : { 'aria-disabled': disabled || undefined })}
      {...rest}
    >
      {children}
    </Component>
  );
}
