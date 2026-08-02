import type { HTMLAttributes, ReactNode } from 'react';

import { Blink } from '../typography/Blink';
import { CoolButton } from '../CoolButton/CoolButton';
import { Marquee } from '../Marquee/Marquee';
import { cx } from '../../utils/cx';

export interface WebRingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Ring name, e.g. "Melbourne Tech Web Ring". */
  name: ReactNode;
  /** Blurb under the title. */
  description?: ReactNode;
  /** Sibling sites, scrolled along the bottom. */
  members?: string[];
  onPrevious?: () => void;
  onRandom?: () => void;
  onNext?: () => void;
  /** Supply hrefs instead of handlers for a no-JavaScript ring. */
  previousHref?: string;
  randomHref?: string;
  nextHref?: string;
}

/**
 * A web ring — the pre-search-engine way sites found each other.
 *
 * The original rendered its controls as `<a href="#">`, which look like
 * buttons but navigate. Here they are real buttons when given handlers, and
 * real links when given hrefs.
 */
export function WebRing({
  name,
  description,
  members = [],
  onPrevious,
  onRandom,
  onNext,
  previousHref,
  randomHref,
  nextHref,
  className,
  ...rest
}: WebRingProps) {
  return (
    <div className={cx('retro-web-ring', className)} {...rest}>
      <h3 className="retro-web-ring__title">🔗 {name} 🔗</h3>

      {description && <p className="retro-web-ring__blurb">{description}</p>}

      <div className="retro-web-ring__nav">
        <CoolButton
          size="sm"
          {...(previousHref ? { href: previousHref } : { onClick: onPrevious })}
        >
          ⏮️ PREVIOUS
        </CoolButton>

        <span className="retro-web-ring__label">
          <Blink>[ WEB RING ]</Blink>
        </span>

        <CoolButton
          size="sm"
          {...(randomHref ? { href: randomHref } : { onClick: onRandom })}
        >
          🎲 RANDOM
        </CoolButton>

        <CoolButton
          size="sm"
          {...(nextHref ? { href: nextHref } : { onClick: onNext })}
        >
          NEXT ⏭️
        </CoolButton>
      </div>

      {members.length > 0 && (
        <div className="retro-web-ring__members">
          <Marquee scrollAmount={2}>
            Member sites: {members.join(' • ')}
          </Marquee>
        </div>
      )}
    </div>
  );
}
