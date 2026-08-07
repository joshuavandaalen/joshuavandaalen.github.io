import { CodeBlock } from '../components/CodeBlock';
import { InstallCommand } from '../components/InstallCommand';
import { Link } from '../lib/router';
import { LINKS, PACKAGE_NAME, PRODUCT_NAME } from '../content/meta';

function Callout({
  tone = 'default',
  icon,
  children,
}: {
  tone?: 'default' | 'accent' | 'warning' | 'success';
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        tone === 'default' ? 'docs-callout' : `docs-callout docs-callout--${tone}`
      }
    >
      <span className="docs-callout__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="docs-callout__body">{children}</div>
    </div>
  );
}

export function Installation() {
  return (
    <>
      <h1>Installation</h1>
      <p className="docs-lede">
        {PRODUCT_NAME} ships ESM, CommonJS and TypeScript declarations, with the
        stylesheet as a separate entry point.
      </p>

      <Callout tone="warning" icon="⚠">
        <strong>Not yet published.</strong> The package is private and carries a
        placeholder name until one is chosen for release. Until then, build it
        from source — the steps are below.
      </Callout>

      <h2>From npm</h2>
      <InstallCommand />

      <h2>From source</h2>
      <CodeBlock
        code={`git clone ${LINKS.github}.git
cd joshuavandaalen.github.io
npm install
npm run build --workspace packages/retro-ui`}
        label="Build from source"
      />

      <h2>Set it up</h2>
      <p>
        Import the stylesheet once, at your application root. It carries the
        design tokens and every component rule.
      </p>
      <CodeBlock
        code={`import '${PACKAGE_NAME}/styles.css';`}
        label="Import the stylesheet"
      />

      <p>
        Then use components. No provider is required — every component works
        standalone with sensible defaults.
      </p>
      <CodeBlock
        code={`import { ContentBox, GlowingTitle, Marquee } from '${PACKAGE_NAME}';

export function App() {
  return (
    <ContentBox>
      <GlowingTitle>✨ WELCOME ✨</GlowingTitle>
      <Marquee behavior="alternate">Hello from 1997</Marquee>
    </ContentBox>
  );
}`}
        label="Basic usage"
      />

      <h2>Add the provider when you need it</h2>
      <p>
        <Link to="/components/retro-provider">
          <code>RetroProvider</code>
        </Link>{' '}
        is optional. Reach for it when you want light mode, or when you want
        animations to run regardless of the visitor’s motion preference.
      </p>
      <CodeBlock
        code={`import { RetroProvider } from '${PACKAGE_NAME}';

<RetroProvider theme="light">
  <App />
</RetroProvider>`}
        label="Using the provider"
      />

      <h2>Just the tokens</h2>
      <p>
        If you only want the palette, bevels and motion scale to build your own
        components on, take the token sheet alone.
      </p>
      <CodeBlock
        code={`import '${PACKAGE_NAME}/tokens.css';`}
        label="Import tokens only"
      />

      <h2>Requirements</h2>
      <ul>
        <li>React 18 or 19 — both are peer dependencies, neither is bundled.</li>
        <li>
          Any bundler that understands ESM. The package sets{' '}
          <code>sideEffects</code> so CSS survives tree-shaking while unused
          components do not.
        </li>
        <li>
          No build-time CSS processing needed — the stylesheet is plain CSS with
          custom properties.
        </li>
      </ul>
    </>
  );
}

export function Theming() {
  return (
    <>
      <h1>Theming &amp; tokens</h1>
      <p className="docs-lede">
        Everything is driven by CSS custom properties under a{' '}
        <code>--retro-</code> prefix, so the raw-CSS consumer path gets the same
        system without a byte of JavaScript.
      </p>

      <h2>Overriding tokens</h2>
      <p>
        Tokens are plain custom properties on <code>:root</code>. Override any
        of them from your own stylesheet — no specificity fight, no{' '}
        <code>!important</code>.
      </p>
      <CodeBlock
        code={`:root {
  --retro-navy: #101033;
  --retro-gold: #f5c542;
  --retro-font-display: 'Comic Neue', cursive;
}`}
        label="Overriding tokens"
      />

      <h2>Bevels are the brand</h2>
      <p>
        Modern systems have a flat border and a shadow scale. This one has a
        bevel scale, because <code>outset</code>, <code>inset</code>,{' '}
        <code>ridge</code> and <code>groove</code> are what make a page read as
        1997. They are first-class tokens rather than values retyped everywhere.
      </p>
      <CodeBlock
        code={`.my-panel {
  border: var(--retro-bevel-outset-gold-lg);
  box-shadow: var(--retro-glow-gold);
}`}
        label="Using bevel tokens"
      />

      <h2>Light and dark</h2>
      <p>
        The light theme is a token swap on{' '}
        <code>[data-retro-theme='light']</code>, not an override sheet. The
        original site applied light mode by injecting about fifty{' '}
        <code>!important</code> declarations at runtime, which meant a consumer
        could never override it.
      </p>
      <CodeBlock
        code={`<RetroProvider theme="light">…</RetroProvider>

// or drive it yourself
document.documentElement.setAttribute('data-retro-theme', 'light');`}
        label="Switching theme"
      />

      <h2>Z-index ladder</h2>
      <p>
        The original scattered <code>9999</code> through <code>9999999</code>{' '}
        across six files with no ordering rationale. The same tiers are now
        named and comparable.
      </p>
      <div className="docs-props-wrap">
        <table className="docs-props">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
              <th scope="col">Layer</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['--retro-z-base', '1', 'Page content'],
              ['--retro-z-decoration', '100', 'Background decoration'],
              ['--retro-z-sticky', '500', 'Sticky elements'],
              ['--retro-z-widget', '9000', 'Music player, theme toggle'],
              ['--retro-z-cursor', '9500', 'Cursor follower, sparkles'],
              ['--retro-z-mascot', '9800', 'Squirrel, narwhal'],
              ['--retro-z-modal', '10000', 'Popups'],
            ].map(([token, value, layer]) => (
              <tr key={token}>
                <th scope="row" className="docs-props__name">
                  {token}
                </th>
                <td>
                  <span className="docs-props__default">{value}</span>
                </td>
                <td>{layer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        The full token reference lives in{' '}
        <a href={`${LINKS.github}/blob/main/docs/DESIGN-SYSTEM.md`}>
          DESIGN-SYSTEM.md
        </a>
        .
      </p>
    </>
  );
}

export function Accessibility() {
  return (
    <>
      <h1>Accessibility</h1>
      <p className="docs-lede">
        A library that looks like 1997 does not have to behave like it. The
        aesthetic is preserved; the era’s harmful habits are not.
      </p>

      <h2>The motion policy</h2>
      <p>
        The original site ran roughly thirty simultaneous animation loops with
        no way to stop any of them, which is genuinely unusable for anyone with
        vestibular sensitivity. Every one of those animations is preserved here
        — and every one is disabled under{' '}
        <code>prefers-reduced-motion: reduce</code>.
      </p>
      <CodeBlock
        code={`@media (prefers-reduced-motion: reduce) {
  :root:not([data-retro-force-motion]) [class*='retro-'] {
    animation: none !important;
    transition: none !important;
  }
}`}
        label="The motion policy rule"
      />

      <Callout tone="accent" icon="♿">
        Because animations can be stripped, every animated component’s{' '}
        <strong>resting state has to be its correct state</strong>. Blinking
        text rests visible. The original’s keyframes ended at{' '}
        <code>opacity: 0</code>, so disabling them left text permanently
        invisible.
      </Callout>

      <p>
        Components whose entire purpose is movement — the mascots, the sparkle
        emitter, the marquee — go further and change what they render, since
        merely stopping their animation is not enough.
      </p>

      <h2>Opting back in</h2>
      <p>
        Some audiences genuinely want the full assault. That is a deliberate,
        explicit choice rather than the default.
      </p>
      <CodeBlock
        code={`<RetroProvider forceMotion>
  <App />
</RetroProvider>`}
        label="Forcing motion"
      />

      <h2>What else was fixed</h2>
      <ul>
        <li>
          <strong>Marquees pause on hover and focus.</strong> WCAG 2.2.2
          requires a mechanism to stop motion that starts automatically and runs
          for more than five seconds — which describes every marquee ever
          written.
        </li>
        <li>
          <strong>Session cards are buttons.</strong> The original used{' '}
          <code>cursor: pointer</code> on a <code>&lt;div&gt;</code>: clickable
          by mouse, invisible to a keyboard.
        </li>
        <li>
          <strong>The schedule is a real table</strong> with a caption and{' '}
          <code>scope</code> on both axes, so a screen reader announces the time
          alongside the room.
        </li>
        <li>
          <strong>Answer options are native radios.</strong> Arrow-key
          navigation and group semantics come from the platform rather than
          being approximated on divs.
        </li>
        <li>
          <strong>Correctness is never colour alone.</strong> Graded answers
          carry a mark glyph and a visually hidden sentence.
        </li>
        <li>
          <strong>
            <code>target="_blank"</code> gets <code>rel="noopener"</code>.
          </strong>{' '}
          The original opened eighteen links without it.
        </li>
        <li>
          <strong>Decoration is hidden.</strong> Mascots, rainbow bars and
          sparkles are <code>aria-hidden</code>; per-character rainbow text is
          announced as a whole word.
        </li>
      </ul>

      <h2>Known limits</h2>
      <Callout tone="warning" icon="⚠">
        <p>
          <strong>Contrast is not guaranteed.</strong> The palette is
          deliberately, historically garish — magenta on cyan was never going to
          pass WCAG AA. If you need an accessible colour contrast ratio, override
          the palette tokens; the structure supports it, the defaults do not.
        </p>
        <p>
          <code>Blink</code> is flashing content. The default 1s cycle is well
          under the 3Hz seizure threshold, but do not push <code>speed</code>{' '}
          below roughly 0.7s.
        </p>
      </Callout>

      <p>
        Every component is checked with <code>axe</code> in the test suite, and
        Storybook runs the a11y addon on each story.
      </p>
    </>
  );
}

export function WithoutReact() {
  return (
    <>
      <h1>Using it without React</h1>
      <p className="docs-lede">
        The stylesheet is a complete, standalone design system. Load it into any
        stack and use the class names directly.
      </p>

      <CodeBlock
        code={`<link rel="stylesheet" href="node_modules/${PACKAGE_NAME}/dist/styles.css" />

<div class="retro-root">
  <div class="retro-container">
    <section class="retro-content-box retro-content-box--halo">
      <h2 class="retro-section-title">NO REACT REQUIRED</h2>
      <p class="retro-text-panel retro-text-panel--intro">
        This page loads only <mark class="retro-highlight">styles.css</mark>.
      </p>
      <div class="retro-center">
        <a href="#" class="retro-cool-button">📅 A BUTTON 📅</a>
      </div>
    </section>
  </div>
</div>`}
        label="Raw CSS usage"
      />

      <h2>Naming</h2>
      <p>
        Class names are BEM: <code>.retro-block</code>,{' '}
        <code>.retro-block__element</code>, <code>.retro-block--modifier</code>.
        Everything is <code>retro-</code> prefixed, and the reset is scoped to{' '}
        <code>.retro-root</code> — so the stylesheet cannot reach anything
        outside the subtree you opt in.
      </p>

      <Callout tone="success" icon="✓">
        That scoping is what lets this documentation site load the kit’s
        stylesheet alongside its own without a single collision. The preview
        frames on every component page are <code>.retro-root</code>; the page
        around them is not.
      </Callout>

      <h2>What you do not get</h2>
      <p>
        The behavioural pieces are React: marquee measurement and reflow, the
        chiptune engine, the mascot animation loops, the popup engine, and the
        motion-preference hooks. The CSS gives you every static appearance and
        the pure-CSS animations.
      </p>
    </>
  );
}

export function NotFound() {
  return (
    <>
      <h1>404 — Page not found</h1>
      <p className="docs-lede">
        That page does not exist. It may never have; the site is{' '}
        <em>perpetually under construction</em>.
      </p>
      <p>
        <Link to="/">Back to the home page</Link> or{' '}
        <Link to="/components">browse the components</Link>.
      </p>
    </>
  );
}
