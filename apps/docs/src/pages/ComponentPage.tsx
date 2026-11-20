import { Link } from '../lib/router';
import { Preview } from '../components/Preview';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import {
  ALL_COMPONENTS,
  COMPONENT_GROUPS,
  findComponent,
  groupOf,
  type ComponentEntry,
} from '../content/catalog';
import { PACKAGE_NAME } from '../content/meta';

function Neighbours({ entry }: { entry: ComponentEntry }) {
  const index = ALL_COMPONENTS.findIndex((item) => item.slug === entry.slug);
  const previous = index > 0 ? ALL_COMPONENTS[index - 1] : undefined;
  const next =
    index < ALL_COMPONENTS.length - 1 ? ALL_COMPONENTS[index + 1] : undefined;

  return (
    <nav className="docs-pager" aria-label="Component navigation">
      {previous ? (
        <Link to={`/components/${previous.slug}`} className="docs-pager__link">
          <span className="docs-pager__dir">← Previous</span>
          <span className="docs-pager__title">{previous.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={`/components/${next.slug}`}
          className="docs-pager__link"
          style={{ textAlign: 'right', marginLeft: 'auto' }}
        >
          <span className="docs-pager__dir">Next →</span>
          <span className="docs-pager__title">{next.name}</span>
        </Link>
      )}
    </nav>
  );
}

export function ComponentPage({ slug }: { slug: string }) {
  const entry = findComponent(slug);

  if (!entry) {
    return (
      <>
        <h1>Component not found</h1>
        <p>
          Nothing is documented under <code>{slug}</code>.{' '}
          <Link to="/components">Browse all components</Link>.
        </p>
      </>
    );
  }

  const group = groupOf(slug);

  return (
    <>
      <div className="docs-meta-row">
        {group && <span className="docs-badge">{group.title}</span>}
        {entry.isNew && (
          <span className="docs-badge docs-badge--new">New in this kit</span>
        )}
      </div>

      <h1>{entry.name}</h1>
      <p className="docs-lede">{entry.summary}</p>

      {entry.description && <p>{entry.description}</p>}

      <h2>Import</h2>
      <CodeBlock
        code={`import { ${entry.name} } from '${PACKAGE_NAME}';`}
        label={`Import ${entry.name}`}
      />

      <h2>Examples</h2>
      {entry.examples.map((example, index) => (
        <div key={index}>
          {example.title && <h3>{example.title}</h3>}
          {example.render ? (
            <Preview
              code={example.code}
              note={example.note}
              dark={example.dark}
            >
              {example.render}
            </Preview>
          ) : (
            <>
              <CodeBlock code={example.code} label={`${entry.name} example`} />
              {example.note && (
                <p className="docs-callout" style={{ marginTop: 12 }}>
                  <span className="docs-callout__icon" aria-hidden="true">
                    ℹ
                  </span>
                  <span className="docs-callout__body">{example.note}</span>
                </p>
              )}
            </>
          )}
        </div>
      ))}

      {entry.accessibility && (
        <>
          <h2>Accessibility</h2>
          <div className="docs-callout docs-callout--accent">
            <span className="docs-callout__icon" aria-hidden="true">
              ♿
            </span>
            <div className="docs-callout__body">{entry.accessibility}</div>
          </div>
        </>
      )}

      {entry.props.length > 0 && (
        <>
          <h2>API reference</h2>
          {entry.props.map((name) => (
            <div key={name}>
              <h3>
                <code>{name}</code>
              </h3>
              <PropsTable name={name} />
            </div>
          ))}
          <p style={{ fontSize: '0.8125rem', opacity: 0.75 }}>
            Generated from the TypeScript source. CI fails if this drifts from
            the code.
          </p>
        </>
      )}

      {entry.related && entry.related.length > 0 && (
        <>
          <h2>Related</h2>
          <div className="docs-grid">
            {entry.related.map((relatedSlug) => {
              const related = findComponent(relatedSlug);
              if (!related) return null;
              return (
                <Link
                  key={relatedSlug}
                  to={`/components/${relatedSlug}`}
                  className="docs-card"
                >
                  <div className="docs-card__title">{related.name}</div>
                  <div className="docs-card__body">{related.summary}</div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <Neighbours entry={entry} />
    </>
  );
}

export function ComponentsIndex() {
  return (
    <>
      <h1>Components</h1>
      <p className="docs-lede">
        {ALL_COMPONENTS.length} documented entries across the kit. Everything
        except the form primitives was extracted from a working 1997-era site.
      </p>

      {COMPONENT_GROUPS.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          <p>{group.description}</p>
          <div className="docs-grid">
            {group.items.map((item) => (
              <Link
                key={item.slug}
                to={`/components/${item.slug}`}
                className="docs-card"
              >
                <div className="docs-card__title">
                  {item.name}
                  {item.isNew && (
                    <span
                      className="docs-badge docs-badge--new"
                      style={{ marginLeft: 8 }}
                    >
                      New
                    </span>
                  )}
                </div>
                <div className="docs-card__body">{item.summary}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
