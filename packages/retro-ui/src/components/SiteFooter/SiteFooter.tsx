import type { HTMLAttributes } from 'react';

import { RainbowBar } from '../RainbowBar/RainbowBar';
import { cx } from '../../utils/cx';

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  rainbowBars?: boolean;
}

/** Purple-gradient page footer, matching the header. */
export function SiteFooter({
  rainbowBars = true,
  className,
  children,
  ...rest
}: SiteFooterProps) {
  return (
    <footer className={cx('retro-site-footer', className)} {...rest}>
      {rainbowBars && <RainbowBar />}
      {children}
      {rainbowBars && <RainbowBar />}
    </footer>
  );
}
