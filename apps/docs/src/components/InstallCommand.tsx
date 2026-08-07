import { useState } from 'react';

import { CopyButton } from './CodeBlock';
import { PACKAGE_NAME } from '../content/meta';

const MANAGERS = [
  { id: 'npm', label: 'npm', prefix: 'npm install' },
  { id: 'pnpm', label: 'pnpm', prefix: 'pnpm add' },
  { id: 'yarn', label: 'yarn', prefix: 'yarn add' },
  { id: 'bun', label: 'bun', prefix: 'bun add' },
] as const;

export interface InstallCommandProps {
  /** Overrides the package name — used on pages that install something else. */
  pkg?: string;
}

export function InstallCommand({ pkg = PACKAGE_NAME }: InstallCommandProps) {
  const [active, setActive] = useState(0);
  const manager = MANAGERS[active]!;
  const command = `${manager.prefix} ${pkg}`;

  return (
    <div className="docs-install">
      <div
        className="docs-install__tabs"
        role="tablist"
        aria-label="Package manager"
      >
        {MANAGERS.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            className="docs-install__tab"
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                setActive((current) => (current + 1) % MANAGERS.length);
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setActive(
                  (current) => (current - 1 + MANAGERS.length) % MANAGERS.length,
                );
              }
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="docs-install__body">
        <span className="docs-install__prompt" aria-hidden="true">
          $
        </span>
        <code className="docs-install__cmd">{command}</code>
        <CopyButton
          text={command}
          label="Copy"
          className="docs-install__copy"
          copiedClassName="docs-install__copy--copied"
        />
      </div>
    </div>
  );
}
