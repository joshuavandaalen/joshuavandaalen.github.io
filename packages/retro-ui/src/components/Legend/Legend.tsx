import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface LegendProps extends HTMLAttributes<HTMLUListElement> {}

/**
 * Key explaining a schedule's colour coding.
 *
 * The original stylesheet defined every rule for this and then never rendered
 * it, so the agenda shipped with five meaningful colours and nothing to say
 * what they meant. Recovered here as a real component.
 */
export function Legend({ className, children, ...rest }: LegendProps) {
  return (
    <ul className={cx('retro-legend', className)} {...rest}>
      {children}
    </ul>
  );
}

export interface LegendItemProps extends HTMLAttributes<HTMLLIElement> {
  /** Any CSS colour or gradient. */
  swatch: string;
  label: ReactNode;
}

export function LegendItem({
  swatch,
  label,
  className,
  ...rest
}: LegendItemProps) {
  return (
    <li className={cx('retro-legend__item', className)} {...rest}>
      <span
        className="retro-legend__swatch"
        aria-hidden="true"
        style={{ '--retro-legend-swatch': swatch } as CSSProperties}
      />
      <span>{label}</span>
    </li>
  );
}
