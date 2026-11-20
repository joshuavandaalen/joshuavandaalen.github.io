import api from '../generated/api.json';

interface ApiProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default: string | null;
}

interface ApiInterface {
  name: string;
  description: string;
  extends: string[];
  props: ApiProp[];
  file: string;
}

const INTERFACES = api.interfaces as ApiInterface[];
const ALIASES = api.typeAliases as Array<{ name: string; type: string }>;

export function findInterface(name: string): ApiInterface | undefined {
  return INTERFACES.find((entry) => entry.name === name);
}

/** Expands a union alias so the table shows members, not just a name. */
function expandType(type: string): string {
  const alias = ALIASES.find((entry) => entry.name === type.trim());
  return alias ? alias.type : type;
}

/**
 * Turns `Omit<HTMLAttributes<HTMLDivElement>, 'onScroll'>` into something a
 * reader can act on, rather than dropping the inherited props silently.
 */
function describeHeritage(clause: string): string | null {
  const element = /HTMLAttributes<HTML(\w*?)Element>/.exec(clause);
  if (!element) return null;
  const tag = element[1]?.toLowerCase();
  const omitted = [...clause.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const base = tag
    ? `all standard \`<${tag === '' ? 'div' : tag}>\` attributes`
    : 'all standard HTML attributes';
  return omitted.length > 0
    ? `${base} except ${omitted.map((o) => `\`${o}\``).join(', ')}`
    : base;
}

export interface PropsTableProps {
  /** Interface name, e.g. `MarqueeProps`. */
  name: string;
}

export function PropsTable({ name }: PropsTableProps) {
  const entry = findInterface(name);

  if (!entry) {
    return (
      <div className="docs-callout docs-callout--warning">
        <span className="docs-callout__icon" aria-hidden="true">
          ⚠
        </span>
        <div className="docs-callout__body">
          No generated API entry for <code>{name}</code>.
        </div>
      </div>
    );
  }

  const inherited = entry.extends
    .map(describeHeritage)
    .filter((value): value is string => Boolean(value));

  return (
    <>
      {entry.props.length > 0 ? (
        <div className="docs-props-wrap">
          <table className="docs-props">
            <caption className="docs-visually-hidden">
              Props for {entry.name}
            </caption>
            <thead>
              <tr>
                <th scope="col">Prop</th>
                <th scope="col">Type</th>
                <th scope="col">Default</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {entry.props.map((prop) => (
                <tr key={prop.name}>
                  <th scope="row" className="docs-props__name">
                    {prop.name}
                    {prop.required && (
                      <>
                        <span className="docs-props__required" aria-hidden="true">
                          *
                        </span>
                        <span className="docs-visually-hidden"> (required)</span>
                      </>
                    )}
                  </th>
                  <td>
                    <span className="docs-props__type">
                      {expandType(prop.type)}
                    </span>
                  </td>
                  <td>
                    <span className="docs-props__default">
                      {prop.default ?? '—'}
                    </span>
                  </td>
                  <td>{prop.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>
          <code>{entry.name}</code> adds no props of its own.
        </p>
      )}

      {inherited.length > 0 && (
        <p className="docs-props-inherited">
          Also accepts {inherited.join('; ')}.
        </p>
      )}
    </>
  );
}
