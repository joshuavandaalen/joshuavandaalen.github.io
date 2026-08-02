import type { CSSProperties, HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

const DEFAULT_COLORS = [
  '#ff0000',
  '#ff7f00',
  '#ffff00',
  '#00ff00',
  '#0000ff',
  '#4b0082',
  '#9400d3',
];

export interface RainbowTextProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Plain text — each character is coloured and animated individually. */
  children: string;
  colors?: string[];
  /** Seconds of offset added per character, producing the travelling wave. */
  stagger?: number;
  /** Set false for colour without the vertical bounce. */
  wave?: boolean;
}

/**
 * Per-character rainbow text with a travelling wave.
 *
 * Splitting a word into one span per letter makes some screen readers announce
 * it letter by letter. To avoid that, the whole string is also rendered once
 * into a visually-hidden span and the decorative letters are hidden from the
 * accessibility tree — so it reads "WELCOME", not "W E L C O M E".
 */
export function RainbowText({
  children,
  colors = DEFAULT_COLORS,
  stagger = 0.1,
  wave = true,
  className,
  ...rest
}: RainbowTextProps) {
  const characters = Array.from(children);

  return (
    <span className={cx('retro-rainbow-text', className)} {...rest}>
      <span className="retro-visually-hidden">{children}</span>
      {characters.map((character, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cx(
            'retro-rainbow-text__char',
            character === ' ' && 'retro-rainbow-text__char--space',
          )}
          style={
            {
              '--retro-char-color': colors[index % colors.length],
              '--retro-char-delay': wave ? `${index * stagger}s` : undefined,
              animation: wave ? undefined : 'none',
            } as CSSProperties
          }
        >
          {character}
        </span>
      ))}
    </span>
  );
}
