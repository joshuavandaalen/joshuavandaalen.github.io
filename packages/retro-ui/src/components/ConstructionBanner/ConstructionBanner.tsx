import type { HTMLAttributes, ReactNode } from 'react';

import { Blink } from '../typography/Blink';
import { Marquee } from '../Marquee/Marquee';
import { cx } from '../../utils/cx';

export interface ConstructionBannerProps
  extends HTMLAttributes<HTMLDivElement> {
  text?: ReactNode;
  /** Spinning glyph at both ends. */
  icon?: ReactNode;
  blink?: boolean;
  scroll?: boolean;
}

/** "Under construction" — the internet's longest-running status. */
export function ConstructionBanner({
  text = 'PERPETUALLY UNDER CONSTRUCTION',
  icon = '🚧',
  blink = true,
  scroll = true,
  className,
  ...rest
}: ConstructionBannerProps) {
  const label = blink ? <Blink>{text}</Blink> : text;

  return (
    <div className={cx('retro-construction', className)} {...rest}>
      <span className="retro-construction__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="retro-construction__text">
        {scroll ? (
          <Marquee direction="right" scrollAmount={5}>
            {label}
          </Marquee>
        ) : (
          label
        )}
      </div>
      <span className="retro-construction__icon" aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}
