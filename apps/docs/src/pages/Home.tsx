import {
  Blink,
  ContentBox,
  CoolButton,
  GlowingTitle,
  Marquee,
  TextPanel,
} from 'retro-ui-kit-PLACEHOLDER';

import { InstallCommand } from '../components/InstallCommand';
import { Link } from '../lib/router';
import { Preview } from '../components/Preview';
import {
  DESCRIPTION,
  IS_PUBLISHED,
  LINKS,
  PRODUCT_NAME,
  STATS,
  TAGLINE,
} from '../content/meta';

const SHOWCASE = `import { ContentBox, GlowingTitle, Marquee } from '${'retro-ui-kit-PLACEHOLDER'}';
import '${'retro-ui-kit-PLACEHOLDER'}/styles.css';

export function App() {
  return (
    <ContentBox>
      <GlowingTitle>✨ WELCOME ✨</GlowingTitle>
      <Marquee behavior="alternate">
        The MOST AWESOME website in the universe
      </Marquee>
    </ContentBox>
  );
}`;

const FEATURES = [
  {
    title: 'Reduced-motion aware',
    body: 'Every one of the 42 animations sits behind prefers-reduced-motion, with an explicit opt-in for pages that want the full 1997 assault regardless.',
  },
  {
    title: 'Works without React',
    body: 'The token and component CSS ships as a standalone stylesheet with BEM class names. Import it into any stack and use the classes directly.',
  },
  {
    title: 'Zero runtime dependencies',
    body: 'React is a peer dependency and nothing else is bundled. The class-name helper and the router on this very site are a dozen lines each rather than a package.',
  },
  {
    title: 'Fully typed',
    body: 'Ships ESM, CJS and declarations. Polymorphic components infer the props of whatever element they render.',
  },
  {
    title: 'Tree-shakeable',
    body: 'Import three components and you ship three components — verified against a real consumer bundle, not assumed.',
  },
  {
    title: 'Design tokens, not magic numbers',
    body: 'Palette, gradients, bevels, glows, motion and a named z-index ladder, all as CSS custom properties you can override.',
  },
];

const PROVENANCE = [
  {
    defect: 'A call to action that never blinked',
    detail:
      'It animated a keyframe name that was never defined anywhere in the stylesheet.',
  },
  {
    defect: 'A colour key that was never rendered',
    detail:
      'Every rule for it existed; no markup ever used them, so the schedule shipped with five meaningful colours and nothing to explain them.',
  },
  {
    defect: '260 lines of dead code',
    detail:
      'A complete popup-ad engine, fully written and never referenced by a single page.',
  },
  {
    defect: 'A dark mode targeting a class that does not exist',
    detail: 'The rule was written for .agenda-table; the real class is .schedule-table.',
  },
];

export function Home() {
  return (
    <>
      <section className="docs-hero">
        <div className="docs-hero__inner">
          <div className="docs-eyebrow">Component library</div>
          <h1 className="docs-hero__title">{TAGLINE}</h1>
          <p className="docs-hero__sub">{DESCRIPTION}</p>

          <div className="docs-hero__actions">
            <Link to="/docs/installation" className="docs-button docs-button--primary">
              Get started
            </Link>
            <Link to="/components" className="docs-button docs-button--secondary">
              Browse components
            </Link>
          </div>

          <div className="docs-hero__install">
            <InstallCommand />
            {!IS_PUBLISHED && (
              <p
                style={{
                  fontSize: '0.8125rem',
                  marginTop: 10,
                  color: 'var(--docs-fg-subtle)',
                }}
              >
                Not yet published — the package name is a placeholder until
                release. <Link to="/docs/installation">Build it from source</Link>.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="docs-section">
        <div className="docs-section__inner">
          <div className="docs-stats">
            {STATS.map((stat) => (
              <div className="docs-stat" key={stat.label}>
                <div className="docs-stat__value">{stat.value}</div>
                <div className="docs-stat__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="docs-section docs-section--subtle">
        <div className="docs-section__inner">
          <h2 className="docs-section__title">See it</h2>
          <p className="docs-section__lede">
            Every example on this site is the real component, rendered live and
            framed. The chrome around it stays calm on purpose — you cannot
            judge a loud component on a loud page.
          </p>
          <Preview code={SHOWCASE} dark note="hover the marquee to pause">
            <ContentBox>
              <GlowingTitle>✨ WELCOME ✨</GlowingTitle>
              <Marquee behavior="alternate" scrollAmount={4}>
                The MOST AWESOME website in the universe
              </Marquee>
              <TextPanel variant="intro">
                Genuinely <Blink>BLINKING</Blink> text, a real bevel, and a
                gradient that has not aged a day.
              </TextPanel>
              <div className="retro-center">
                <CoolButton>CLICK ME</CoolButton>
              </div>
            </ContentBox>
          </Preview>
        </div>
      </section>

      <section className="docs-section">
        <div className="docs-section__inner">
          <h2 className="docs-section__title">Built like a library, not a gag</h2>
          <p className="docs-section__lede">
            The aesthetic is a joke. The engineering is not.
          </p>
          <div className="docs-grid">
            {FEATURES.map((feature) => (
              <div className="docs-card" key={feature.title}>
                <div className="docs-card__title">{feature.title}</div>
                <div className="docs-card__body">{feature.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="docs-section docs-section--subtle">
        <div className="docs-section__inner">
          <div className="docs-eyebrow">Provenance</div>
          <h2 className="docs-section__title">Extracted, not invented</h2>
          <p className="docs-section__lede">
            These components were not designed from a mood board. They were
            lifted from a working GeoCities-era conference site — 4,100 lines of
            hand-written HTML, CSS and vanilla JavaScript — and rebuilt one at a
            time. Reading that closely turned up six defects nobody had noticed.
          </p>

          <div className="docs-grid">
            {PROVENANCE.map((item) => (
              <div className="docs-card" key={item.defect}>
                <div className="docs-card__title">{item.defect}</div>
                <div className="docs-card__body">{item.detail}</div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 24 }}>
            <a href={`${LINKS.github}/blob/main/docs/CATALOG.md`}>
              Read the full source catalog →
            </a>
          </p>
        </div>
      </section>

      <section className="docs-section">
        <div className="docs-section__inner">
          <h2 className="docs-section__title">
            Faithful to 1997, except where 1997 was wrong
          </h2>
          <p className="docs-section__lede">
            Reproducing the original exactly would have shipped genuinely bad
            components. Where the era’s habits were harmful rather than merely
            loud, they were fixed — and the reasoning is written down.
          </p>

          <div className="docs-grid">
            <div className="docs-card">
              <div className="docs-card__title">Marquee, without the element</div>
              <div className="docs-card__body">
                <code>&lt;marquee&gt;</code> was removed from the HTML standard.
                This reimplements it on transforms, reflows on resize, and
                pauses on hover as WCAG 2.2.2 requires.
              </div>
            </div>
            <div className="docs-card">
              <div className="docs-card__title">Blinking text stays readable</div>
              <div className="docs-card__body">
                The original’s keyframes ended at <code>opacity: 0</code>, so
                disabling the animation left text permanently invisible. The
                resting state is now visible.
              </div>
            </div>
            <div className="docs-card">
              <div className="docs-card__title">Buttons, not clickable divs</div>
              <div className="docs-card__body">
                Session cards had <code>cursor: pointer</code> on a{' '}
                <code>&lt;div&gt;</code> — clickable by mouse, invisible to a
                keyboard.
              </div>
            </div>
            <div className="docs-card">
              <div className="docs-card__title">A table that is a table</div>
              <div className="docs-card__body">
                The schedule now has a caption and <code>scope</code> on both
                axes, so a screen reader announces the time and room together.
              </div>
            </div>
          </div>

          <p style={{ marginTop: 24 }}>
            <Link to="/docs/accessibility">
              Read the accessibility notes →
            </Link>
          </p>
        </div>
      </section>

      <section className="docs-section docs-section--subtle">
        <div className="docs-section__inner">
          <h2 className="docs-section__title">Explore</h2>
          <div className="docs-grid">
            <a className="docs-card" href={LINKS.storybook}>
              <div className="docs-card__title">Storybook →</div>
              <div className="docs-card__body">
                Every component in isolation, including the fixed-position
                mascots and popups that cannot be framed on this site.
              </div>
            </a>
            <a className="docs-card" href={LINKS.quiz}>
              <div className="docs-card__title">Demo app →</div>
              <div className="docs-card__body">
                DevOps Dojo, an Azure and Kubernetes interview trainer built
                entirely from {PRODUCT_NAME}.
              </div>
            </a>
            <a className="docs-card" href={LINKS.retro}>
              <div className="docs-card__title">The original site →</div>
              <div className="docs-card__body">
                The 1997-style page all of this was extracted from, preserved
                exactly as it was.
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
