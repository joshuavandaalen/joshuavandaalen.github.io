import { useMemo, useState } from 'react';

import { Link, useRouter } from '../lib/router';
import { COMPONENT_GROUPS, GUIDES } from '../content/catalog';

/** Filterable navigation over the guides and the whole component surface. */
export function Sidebar() {
  const { path } = useRouter();
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return COMPONENT_GROUPS;

    return COMPONENT_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(needle) ||
          item.summary.toLowerCase().includes(needle),
      ),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const totalShown = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <nav aria-label="Documentation sections">
      <label className="docs-visually-hidden" htmlFor="docs-filter">
        Filter components
      </label>
      <input
        id="docs-filter"
        type="search"
        className="docs-sidebar__filter"
        placeholder="Filter components…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {!query && (
        <div className="docs-sidebar__group">
          <div className="docs-sidebar__heading">Guides</div>
          <ul className="docs-sidebar__list">
            {GUIDES.map((guide) => (
              <li key={guide.to}>
                <Link
                  to={guide.to}
                  className={
                    path === guide.to
                      ? 'docs-sidebar__link docs-sidebar__link--active'
                      : 'docs-sidebar__link'
                  }
                >
                  {guide.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Announced politely so filtering tells a screen-reader user how many
          results they now have, instead of the list silently changing. */}
      <p className="docs-visually-hidden" role="status">
        {query ? `${totalShown} components match ${query}` : ''}
      </p>

      {groups.map((group) => (
        <div className="docs-sidebar__group" key={group.title}>
          <div className="docs-sidebar__heading">{group.title}</div>
          <ul className="docs-sidebar__list">
            {group.items.map((item) => {
              const to = `/components/${item.slug}`;
              return (
                <li key={item.slug}>
                  <Link
                    to={to}
                    className={
                      path === to
                        ? 'docs-sidebar__link docs-sidebar__link--active'
                        : 'docs-sidebar__link'
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {groups.length === 0 && (
        <p className="docs-sidebar__empty">No components match “{query}”.</p>
      )}
    </nav>
  );
}
