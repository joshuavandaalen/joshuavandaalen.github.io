import type { HTMLAttributes, ReactNode } from 'react';

import type { SponsorTierName } from '../../types';
import { cx } from '../../utils/cx';

// `title` is rich content here, not the HTML tooltip attribute.
export interface SponsorTierProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  tier: SponsorTierName;
  title: ReactNode;
}

/** A titled band of sponsor cards, skinned by tier. */
export function SponsorTier({
  tier,
  title,
  className,
  children,
  ...rest
}: SponsorTierProps) {
  return (
    <section className={cx('retro-sponsor-tier', className)} {...rest}>
      <h3 className={cx('retro-sponsor-tier__title', `retro-sponsor-tier__title--${tier}`)}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export interface SponsorGridProps extends HTMLAttributes<HTMLUListElement> {
  /** Single centred column — for a lone top-tier sponsor. */
  single?: boolean;
  /** Minimum card width before the grid rewraps. */
  minCardWidth?: number;
}

export function SponsorGrid({
  single = false,
  minCardWidth,
  className,
  style,
  children,
  ...rest
}: SponsorGridProps) {
  return (
    <ul
      className={cx(
        'retro-sponsor-grid',
        single && 'retro-sponsor-grid--single',
        className,
      )}
      style={
        minCardWidth
          ? ({ '--retro-sponsor-min': `${minCardWidth}px`, ...style } as never)
          : style
      }
      {...rest}
    >
      {children}
    </ul>
  );
}

export interface SponsorCardProps extends HTMLAttributes<HTMLLIElement> {
  name: ReactNode;
  href?: string;
  tier?: SponsorTierName;
  /** Blinking text revealed on hover — "★ CLICK ME! ★". */
  hoverText?: ReactNode;
  /** Logo or mark above the name. */
  logo?: ReactNode;
}

export function SponsorCard({
  name,
  href,
  tier = 'gold',
  hoverText,
  logo,
  className,
  children,
  ...rest
}: SponsorCardProps) {
  const body = (
    <>
      {logo}
      <div className="retro-sponsor-card__name">{name}</div>
      {hoverText && (
        <div className="retro-sponsor-card__hover">{hoverText}</div>
      )}
      {children}
    </>
  );

  return (
    <li
      className={cx(
        'retro-sponsor-card',
        `retro-sponsor-card--${tier}`,
        className,
      )}
      {...rest}
    >
      {href ? (
        <a
          className="retro-sponsor-card__link"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}

export interface ServiceSponsorSectionProps
  extends HTMLAttributes<HTMLDivElement> {
  /** What they provided — "Wi-Fi by:", "Coffee Cart by:". */
  category: ReactNode;
}

/** Dashed-border sub-group for sponsors of a specific service. */
export function ServiceSponsorSection({
  category,
  className,
  children,
  ...rest
}: ServiceSponsorSectionProps) {
  return (
    <div className={cx('retro-service-sponsors', className)} {...rest}>
      <h4 className="retro-service-sponsors__category">{category}</h4>
      {children}
    </div>
  );
}
