import type { AnchorHTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

export interface RetroLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Add `target="_blank"` plus the `rel` that makes it safe.
   *
   * The original site used `target="_blank"` on eighteen links without
   * `rel="noopener"`, which hands the opened page a reference back to yours.
   */
  external?: boolean;
}

/** Blue, underlined, purple once visited — the default Netscape link, on purpose. */
export function RetroLink({
  external = false,
  className,
  children,
  target,
  rel,
  ...rest
}: RetroLinkProps) {
  const resolvedTarget = target ?? (external ? '_blank' : undefined);
  const needsRel = resolvedTarget === '_blank';

  return (
    <a
      className={cx('retro-link', className)}
      target={resolvedTarget}
      rel={rel ?? (needsRel ? 'noopener noreferrer' : undefined)}
      {...rest}
    >
      {children}
    </a>
  );
}
