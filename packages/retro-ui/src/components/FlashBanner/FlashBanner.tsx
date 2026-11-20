import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../utils/cx';

// `title` is overridden as rich content rather than the HTML tooltip attribute.
export interface FlashBannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Spinning glyph on the left. */
  leftIcon?: ReactNode;
  /** Spinning glyph on the right — counter-rotates. */
  rightIcon?: ReactNode;
  /** Corner plugin-requirement chip. Pass `null` to drop it. */
  badge?: ReactNode;
}

const DEFAULT_BADGE = (
  <>
    <span style={{ fontSize: '10px' }}>📺 REQUIRES</span>
    <br />
    <span style={{ fontWeight: 'bold' }}>FLASH 8+</span>
  </>
);

/**
 * A tribute to the Flash splash banner.
 *
 * Entirely CSS and DOM — no plugin, no `.swf`, and no security advisories.
 */
export function FlashBanner({
  title,
  subtitle,
  leftIcon = '💿',
  rightIcon = '🎪',
  badge = DEFAULT_BADGE,
  className,
  ...rest
}: FlashBannerProps) {
  return (
    <div className={cx('retro-flash-banner', className)} {...rest}>
      <div className="retro-flash-banner__content">
        <div className="retro-flash-banner__spinner" aria-hidden="true">
          {leftIcon}
        </div>
        <div className="retro-flash-banner__text-container">
          <div className="retro-flash-banner__text">{title}</div>
          {subtitle && (
            <div className="retro-flash-banner__subtext">{subtitle}</div>
          )}
        </div>
        <div
          className="retro-flash-banner__spinner retro-flash-banner__spinner--reverse"
          aria-hidden="true"
        >
          {rightIcon}
        </div>
      </div>
      {badge && <div className="retro-flash-banner__badge">{badge}</div>}
    </div>
  );
}
