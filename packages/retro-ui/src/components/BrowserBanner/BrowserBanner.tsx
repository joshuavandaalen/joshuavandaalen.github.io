import type { HTMLAttributes, ReactNode } from 'react';

import { Blink } from '../typography/Blink';
import { Marquee } from '../Marquee/Marquee';
import { cx } from '../../utils/cx';

/** Period-accurate boasts, so nobody has to retype them. */
export const BROWSER_PRESETS = {
  netscape: '⚡ BEST VIEWED IN NETSCAPE NAVIGATOR 4.0+ ⚡',
  ie: '⚡ OPTIMIZED FOR INTERNET EXPLORER 5 ⚡',
  resolution: '⚡ OPTIMIZED FOR 800x600 RESOLUTION ⚡',
  modem: '⚡ OPTIMIZED FOR 56K MODEM ⚡',
} as const;

export type BrowserPreset = keyof typeof BROWSER_PRESETS;

export interface BrowserBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom text. Takes precedence over `preset`. */
  text?: ReactNode;
  preset?: BrowserPreset;
  /** Decorative glyphs at either end. */
  icon?: ReactNode;
  blink?: boolean;
  scroll?: boolean;
}

/** The rainbow "best viewed in…" strip that opened every self-respecting page. */
export function BrowserBanner({
  text,
  preset = 'netscape',
  icon = '🌐',
  blink = true,
  scroll = true,
  className,
  ...rest
}: BrowserBannerProps) {
  const content = text ?? BROWSER_PRESETS[preset];
  const inner = blink ? <Blink>{content}</Blink> : content;

  return (
    <div className={cx('retro-browser-banner', className)} {...rest}>
      <span className="retro-browser-banner__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="retro-browser-banner__text">
        {scroll ? (
          <Marquee behavior="alternate" scrollAmount={3}>
            {inner}
          </Marquee>
        ) : (
          inner
        )}
      </div>
      <span className="retro-browser-banner__icon" aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}
