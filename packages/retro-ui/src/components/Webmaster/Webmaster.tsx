import type { HTMLAttributes, ReactNode } from 'react';

import { Blink } from '../typography/Blink';
import { Highlight } from '../typography/Highlight';
import { cx } from '../../utils/cx';

export interface WebmasterProps extends HTMLAttributes<HTMLDivElement> {
  name: ReactNode;
  /** Honorifics — "Keeper of the Sacred HTML", and so on. */
  titles?: ReactNode;
  email?: string;
  /** Text introducing the email address. */
  contactPrefix?: ReactNode;
  /** The sign-off — "Proudly hand-coded in Notepad.exe". */
  colophon?: ReactNode;
}

/**
 * The webmaster credit panel.
 *
 * Every page of the era had one. Extracted from a block of inline styles into
 * a component with an actual `mailto:` link.
 */
export function Webmaster({
  name,
  titles,
  email,
  contactPrefix = 'For website inquiries, fan mail, or GeoCities tips:',
  colophon = '⚡ Proudly hand-coded in Notepad.exe ⚡',
  className,
  children,
  ...rest
}: WebmasterProps) {
  return (
    <div className={cx('retro-webmaster', className)} {...rest}>
      <p className="retro-webmaster__name">⭐ {name} ⭐</p>

      {titles && (
        <Blink as="p" className="retro-webmaster__titles">
          {titles}
        </Blink>
      )}

      {email && (
        <p className="retro-webmaster__contact">
          📧 {contactPrefix}{' '}
          <Highlight>
            <a href={`mailto:${email}`}>{email}</a>
          </Highlight>
        </p>
      )}

      {colophon && <p className="retro-webmaster__colophon">{colophon}</p>}
      {children}
    </div>
  );
}
