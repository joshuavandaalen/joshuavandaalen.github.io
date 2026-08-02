import { Fragment, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface FooterLinkItem {
  label: ReactNode;
  href: string;
  external?: boolean;
}

export interface FooterLinksProps extends HTMLAttributes<HTMLElement> {
  links: FooterLinkItem[];
  /** Character drawn between links. */
  separator?: string;
}

/** Pipe-separated footer navigation. */
export function FooterLinks({
  links,
  separator = '|',
  className,
  ...rest
}: FooterLinksProps) {
  return (
    <nav className={cx('retro-footer-links', className)} {...rest}>
      {links.map((link, index) => (
        <Fragment key={`${link.href}-${index}`}>
          {index > 0 && (
            <span className="retro-footer-links__separator" aria-hidden="true">
              {separator}
            </span>
          )}
          <a
            className="retro-footer-links__link"
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </a>
        </Fragment>
      ))}
    </nav>
  );
}
