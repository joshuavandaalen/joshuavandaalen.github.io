import type { HTMLAttributes, ReactNode } from 'react';

import { Marquee } from '../Marquee/Marquee';
import { RainbowBar } from '../RainbowBar/RainbowBar';
import { cx } from '../../utils/cx';

export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Scrolling strapline in the black panel below the title. */
  subtitle?: ReactNode;
  /** Rainbow bars top and bottom. */
  rainbowBars?: boolean;
}

/** Purple-gradient page header, rainbow-barred at both ends. */
export function SiteHeader({
  subtitle,
  rainbowBars = true,
  className,
  children,
  ...rest
}: SiteHeaderProps) {
  return (
    <header className={cx('retro-site-header', className)} {...rest}>
      {rainbowBars && <RainbowBar />}
      {children}
      {subtitle && (
        <div className="retro-site-header__subtitle">
          <Marquee direction="left" scrollAmount={6}>
            {subtitle}
          </Marquee>
        </div>
      )}
      {rainbowBars && <RainbowBar />}
    </header>
  );
}
