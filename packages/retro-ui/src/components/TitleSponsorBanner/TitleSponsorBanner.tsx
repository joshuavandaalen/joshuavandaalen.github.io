import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { Blink } from '../typography/Blink';
import { Marquee } from '../Marquee/Marquee';
import { cx } from '../../utils/cx';

export interface TitleSponsorBannerProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Wordmark, set in Impact with heavy letter-spacing. */
  logo: ReactNode;
  /** Smaller monospace line under the wordmark. */
  sublogo?: ReactNode;
  /** Scrolling strapline. */
  tagline?: ReactNode;
  /** Body copy under the tagline. */
  details?: ReactNode;
  /** Blinking call to action inside the details line. */
  cta?: ReactNode;
  /** Chips along the bottom. */
  badges?: ReactNode[];
  href?: string;
  /**
   * Brand colour driving the border glow, wordmark shadow and tagline strip.
   * The original hard-coded one sponsor's red throughout; this is that same
   * design with the brand pulled out as a variable.
   */
  accentColor?: string;
  /** Brighter accent used at the peak of each pulse. Derived if omitted. */
  accentBright?: string;
  /** Darker accent used for the hard drop shadow. Derived if omitted. */
  accentDark?: string;
}

/**
 * The full-width title-sponsor ad unit: glowing border, animated wordmark,
 * scrolling tagline and badge row.
 *
 * Generalised from the site's single hard-coded sponsor so it can carry any
 * brand. The call to action now actually blinks — the original animated a
 * keyframe name that was never defined, so it silently sat still.
 */
export function TitleSponsorBanner({
  logo,
  sublogo,
  tagline,
  details,
  cta,
  badges = [],
  href,
  accentColor = '#cc0000',
  accentBright,
  accentDark,
  className,
  style,
  ...rest
}: TitleSponsorBannerProps) {
  const content = (
    <>
      <div className="retro-title-banner__logo-box">
        <div className="retro-title-banner__logo">{logo}</div>
        {sublogo && (
          <div className="retro-title-banner__sublogo">{sublogo}</div>
        )}
      </div>

      {tagline && (
        <div className="retro-title-banner__tagline">
          <Marquee direction="left" scrollAmount={3}>
            {tagline}
          </Marquee>
        </div>
      )}

      {(details || cta) && (
        <div className="retro-title-banner__details">
          {cta && (
            <>
              <Blink className="retro-title-banner__cta">{cta}</Blink>{' '}
            </>
          )}
          {details}
        </div>
      )}

      {badges.length > 0 && (
        <ul className="retro-title-banner__badges">
          {badges.map((badge, index) => (
            <li key={index} className="retro-badge retro-badge--dark">
              {badge}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div
      className={cx('retro-title-banner', className)}
      style={
        {
          '--retro-banner-accent': accentColor,
          '--retro-banner-accent-bright': accentBright ?? accentColor,
          '--retro-banner-accent-dark': accentDark ?? accentColor,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {href ? (
        <a
          className="retro-title-banner__link"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export interface TitleSponsorTierProps extends HTMLAttributes<HTMLHeadingElement> {
  accentColor?: string;
}

/** The pulsing "TITLE SPONSOR" ribbon that sits above the banner. */
export function TitleSponsorTier({
  accentColor = '#cc0000',
  className,
  style,
  children,
  ...rest
}: TitleSponsorTierProps) {
  return (
    <h3
      className={cx('retro-title-banner__tier-title', className)}
      style={
        {
          '--retro-banner-accent': accentColor,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </h3>
  );
}
