import { useEffect, useState, type ReactNode } from 'react';

import { Link, useRouter } from '../lib/router';
import { LINKS, PRODUCT_NAME } from '../content/meta';
import { ThemeToggle } from './ThemeToggle';

export interface NavLink {
  label: string;
  to: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Docs', to: '/docs/installation' },
  { label: 'Components', to: '/components' },
  { label: 'Theming', to: '/docs/theming' },
  { label: 'Accessibility', to: '/docs/accessibility' },
];

export function Nav({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { path } = useRouter();

  return (
    <header className="docs-nav">
      {onToggleSidebar && (
        <button
          type="button"
          className="docs-icon-button docs-nav__menu-button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      )}

      <Link to="/" className="docs-nav__brand">
        <span className="docs-nav__mark" aria-hidden="true">
          ▓
        </span>
        {PRODUCT_NAME}
      </Link>

      <nav className="docs-nav__links" aria-label="Main">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={
              path.startsWith(link.to.split('/').slice(0, 2).join('/')) &&
              link.to !== '/'
                ? 'docs-nav__link docs-nav__link--active'
                : 'docs-nav__link'
            }
          >
            {link.label}
          </Link>
        ))}
        <a className="docs-nav__link" href={LINKS.storybook}>
          Storybook
        </a>
        <a
          className="docs-nav__link"
          href={LINKS.github}
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="docs-footer">
      <div className="docs-footer__inner">
        <div className="docs-footer__note">
          <strong>{PRODUCT_NAME}</strong>
          <p style={{ marginTop: 8 }}>
            Extracted from a working GeoCities-era conference site, rebuilt as a
            typed component library. MIT licensed.
          </p>
        </div>

        <div className="docs-footer__group">
          <h3>Documentation</h3>
          <ul>
            <li>
              <Link to="/docs/installation">Installation</Link>
            </li>
            <li>
              <Link to="/docs/theming">Theming</Link>
            </li>
            <li>
              <Link to="/docs/accessibility">Accessibility</Link>
            </li>
            <li>
              <Link to="/docs/without-react">Without React</Link>
            </li>
          </ul>
        </div>

        <div className="docs-footer__group">
          <h3>Explore</h3>
          <ul>
            <li>
              <Link to="/components">All components</Link>
            </li>
            <li>
              <a href={LINKS.storybook}>Storybook</a>
            </li>
            <li>
              <a href={LINKS.quiz}>Demo app</a>
            </li>
            <li>
              <a href={LINKS.retro}>The original 1997 site</a>
            </li>
          </ul>
        </div>

        <div className="docs-footer__group">
          <h3>Project</h3>
          <ul>
            <li>
              <a href={LINKS.github} rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a
                href={`${LINKS.github}/blob/main/docs/CATALOG.md`}
                rel="noopener noreferrer"
              >
                Source catalog
              </a>
            </li>
            <li>
              <a
                href={`${LINKS.github}/blob/main/docs/DESIGN-SYSTEM.md`}
                rel="noopener noreferrer"
              >
                Design tokens
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/** Page shell with a sidebar. Used by docs and component pages. */
export function SidebarLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { path } = useRouter();

  // Close the drawer on navigation, or it obscures the page just reached.
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <a className="docs-skip" href="#main">
        Skip to content
      </a>
      <Nav onToggleSidebar={() => setOpen((v) => !v)} />
      <div className="docs-shell">
        <aside
          className={open ? 'docs-sidebar docs-sidebar--open' : 'docs-sidebar'}
          aria-label="Documentation"
        >
          {sidebar}
        </aside>
        {open && (
          <button
            type="button"
            className="docs-sidebar-scrim"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
        )}
        <main className="docs-main" id="main">
          <div className="docs-content docs-prose">{children}</div>
        </main>
      </div>
      <Footer />
    </>
  );
}

/** Full-width shell, for the landing page. */
export function PlainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="docs-skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
