import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Props for a component that can render as a different element via `as`,
 * while keeping the underlying element's own props typed.
 *
 * Used by the components that legitimately need to be either a link or a
 * button depending on context — `CoolButton` and `NavButton` are both, on the
 * original site, sometimes an `<a href>` and sometimes a click handler.
 */
export type PolymorphicProps<
  TElement extends ElementType,
  TOwnProps = Record<never, never>,
> = TOwnProps &
  Omit<ComponentPropsWithoutRef<TElement>, keyof TOwnProps | 'as'> & {
    as?: TElement;
  };

/** Sponsor tiers, ordered by how much the logo costs. */
export type SponsorTierName =
  | 'diamond'
  | 'platinum'
  | 'gold'
  | 'silver'
  | 'service';

/** The five room-tint columns a schedule can use. */
export type TrackNumber = 1 | 2 | 3 | 4 | 5;

/** Colour theme. Dark is the default — the navy starfield is the house style. */
export type RetroTheme = 'dark' | 'light';

export interface WithChildren {
  children?: ReactNode;
}
