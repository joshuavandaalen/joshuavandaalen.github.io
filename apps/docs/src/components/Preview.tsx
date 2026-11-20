import { useId, useRef, useState, type ReactNode } from 'react';

import { CodeBlock } from './CodeBlock';

export interface PreviewProps {
  children: ReactNode;
  code: string;
  /** Note in the tab strip, e.g. "hover to pause". */
  note?: string;
  /** Navy backdrop, for components designed to sit on the starfield. */
  dark?: boolean;
}

const TABS = ['Preview', 'Code'] as const;

/**
 * A rendered example with a toggle to its source.
 *
 * Implemented as a real tablist with roving tabindex and arrow-key navigation.
 * A site whose accessibility page is served by inaccessible tabs would not be
 * worth reading.
 */
export function Preview({ children, code, note, dark = false }: PreviewProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const bounded = (index + TABS.length) % TABS.length;
    setActive(bounded);
    tabRefs.current[bounded]?.focus();
  };

  return (
    <div className="docs-preview">
      <div className="docs-preview__tabs" role="tablist" aria-label="Example view">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-controls={`${baseId}-panel-${index}`}
            aria-selected={active === index}
            // Roving tabindex: one stop for the whole group, then arrows.
            tabIndex={active === index ? 0 : -1}
            className="docs-preview__tab"
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                focusTab(index + 1);
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                focusTab(index - 1);
              } else if (event.key === 'Home') {
                event.preventDefault();
                focusTab(0);
              } else if (event.key === 'End') {
                event.preventDefault();
                focusTab(TABS.length - 1);
              }
            }}
          >
            {tab}
          </button>
        ))}
        {note && <span className="docs-preview__label">{note}</span>}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-0`}
        aria-labelledby={`${baseId}-tab-0`}
        hidden={active !== 0}
        className="docs-preview__panel"
      >
        <div
          className={
            dark
              ? 'docs-preview__stage docs-preview__stage--dark'
              : 'docs-preview__stage'
          }
        >
          {/* `.retro-root` scopes the kit's font, colours and reset to the
              inside of this frame, so it never reaches the docs chrome. */}
          <div className="retro-root">{children}</div>
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-1`}
        aria-labelledby={`${baseId}-tab-1`}
        hidden={active !== 1}
        className="docs-preview__panel"
      >
        <CodeBlock code={code} label="Example source" />
      </div>
    </div>
  );
}
