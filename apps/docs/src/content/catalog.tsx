import type { ReactNode } from 'react';
import {
  AnswerList,
  Badge,
  BadgeRow,
  Blink,
  BrowserBanner,
  ConstructionBanner,
  ContentBox,
  CoolButton,
  DarkModeToggle,
  DateItem,
  DateList,
  FeedbackPanel,
  FlashBanner,
  FooterLinks,
  GlowingTitle,
  Highlight,
  Legend,
  LegendItem,
  Marquee,
  MidiPlayer,
  NavBar,
  NavButton,
  ProgressMeter,
  RainbowBar,
  RainbowText,
  RetroLink,
  ScheduleCell,
  ScheduleHeader,
  ScheduleRow,
  ScheduleTable,
  ScorePanel,
  SectionTitle,
  ServiceSponsorSection,
  SessionCard,
  SiteFooter,
  SiteHeader,
  SponsorCard,
  SponsorGrid,
  SponsorTier,
  TextPanel,
  TimeCell,
  TitleSponsorBanner,
  VisitorCounter,
  WebRing,
  Webmaster,
  Win95Button,
  Window95,
} from 'retro-ui-kit-PLACEHOLDER';

export interface Guide {
  label: string;
  to: string;
}

export const GUIDES: Guide[] = [
  { label: 'Introduction', to: '/docs/installation' },
  { label: 'Theming & tokens', to: '/docs/theming' },
  { label: 'Accessibility', to: '/docs/accessibility' },
  { label: 'Using it without React', to: '/docs/without-react' },
];

export interface ComponentExample {
  title?: string;
  code: string;
  /** Omitted when a component takes over the viewport and cannot be framed. */
  render?: ReactNode;
  note?: string;
  dark?: boolean;
}

export interface ComponentEntry {
  name: string;
  slug: string;
  summary: string;
  /** Longer description, shown above the examples. */
  description?: string;
  /** Interface names in the generated API to render tables for. */
  props: string[];
  examples: ComponentExample[];
  /** Accessibility behaviour worth stating explicitly. */
  accessibility?: string;
  /** True for the four components not extracted from the original site. */
  isNew?: boolean;
  related?: string[];
}

export interface ComponentGroup {
  title: string;
  description: string;
  items: ComponentEntry[];
}

const SAMPLE_OPTIONS = [
  { id: 'a', children: 'Check node allocatable capacity' },
  { id: 'b', children: 'Increase the pod CPU limit' },
  { id: 'c', children: 'Restart the kubelet' },
];

export const COMPONENT_GROUPS: ComponentGroup[] = [
  {
    title: 'Foundation',
    description: 'Context and hooks that the rest of the kit reads from.',
    items: [
      {
        name: 'RetroProvider',
        slug: 'retro-provider',
        summary: 'Supplies theme and motion policy to the kit.',
        description:
          'Optional — every component works standalone with sensible defaults. Wrap your app when you want light mode, or when you want animations to run regardless of the visitor’s reduced-motion setting.',
        props: ['RetroProviderProps'],
        accessibility:
          'forceMotion is off by default. Turning it on overrides prefers-reduced-motion for every component in the kit, so reach for it only when the audience has genuinely asked for it.',
        examples: [
          {
            code: `import { RetroProvider } from '${'retro-ui-kit-PLACEHOLDER'}';

<RetroProvider theme="dark" forceMotion={false}>
  <App />
</RetroProvider>`,
          },
        ],
        related: ['use-reduced-motion'],
      },
      {
        name: 'useReducedMotion',
        slug: 'use-reduced-motion',
        summary:
          'True when the visitor wants reduced motion and forceMotion is off.',
        description:
          'CSS handles most of the motion policy on its own. This hook exists for components whose entire purpose is movement — mascots, the sparkle emitter, the marquee — which need to change what they render, not merely stop animating.',
        props: [],
        examples: [
          {
            code: `const reducedMotion = useReducedMotion();

if (reducedMotion) return <StaticFallback />;
return <Animated />;`,
          },
        ],
      },
      {
        name: 'useVisitorCounter',
        slug: 'use-visitor-counter',
        summary: 'Fetches and zero-pads a server-side hit count.',
        props: [],
        examples: [
          {
            code: `const { formatted, loading, error, refresh } = useVisitorCounter({
  endpoint: '/api/visitors',
  digits: 6,
  fallback: 123456,
});

<VisitorCounter count={Number(formatted)} />`,
            note: 'aborts on unmount; falls back rather than rendering NaN',
          },
        ],
      },
      {
        name: 'useKonamiCode',
        slug: 'use-konami-code',
        summary: 'Fires a callback on ↑ ↑ ↓ ↓ ← → ← → B A.',
        props: [],
        examples: [
          {
            code: `useKonamiCode(() => setChaos(true));`,
            note: 'case-insensitive, so caps lock does not break it',
          },
        ],
      },
      {
        name: 'useChiptune',
        slug: 'use-chiptune',
        summary:
          'Owns a ChiptuneEngine for a component’s lifetime and disposes it on unmount.',
        props: [],
        examples: [
          {
            code: `const { playing, toggle, supported } = useChiptune({ volume: 0.45 });

<button onClick={toggle} disabled={!supported}>
  {playing ? 'Mute' : 'Play'}
</button>`,
          },
        ],
      },
    ],
  },
  {
    title: 'Layout',
    description: 'The page scaffolding: background, container, header, footer.',
    items: [
      {
        name: 'StarfieldBackground',
        slug: 'starfield-background',
        summary: 'Fixed starfield with an optional twinkle.',
        description:
          'Star positions come from a seeded PRNG rather than Math.random, so server and client renders agree and hydration does not mismatch.',
        props: ['StarfieldBackgroundProps'],
        examples: [
          {
            code: `<StarfieldBackground density={150} twinkle seed={1997} />`,
            render: (
              <div style={{ position: 'relative', height: 160 }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#000080',
                    overflow: 'hidden',
                  }}
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        position: 'absolute',
                        top: `${(i * 37) % 100}%`,
                        left: `${(i * 61) % 100}%`,
                        width: 2,
                        height: 2,
                        borderRadius: '50%',
                        background: i % 3 === 0 ? '#ffff00' : '#ffffff',
                      }}
                    />
                  ))}
                </div>
              </div>
            ),
            note: 'static illustration — the real one is position: fixed',
          },
        ],
      },
      {
        name: 'PageContainer',
        slug: 'page-container',
        summary: 'The centred 1200px stage every page sits on.',
        props: ['PageContainerProps'],
        examples: [
          {
            code: `<PageContainer>
  <SiteHeader>…</SiteHeader>
  <main>…</main>
</PageContainer>`,
          },
        ],
      },
      {
        name: 'ContentBox',
        slug: 'content-box',
        summary: 'Bevelled gradient panel with an optional rainbow halo.',
        props: ['ContentBoxOwnProps'],
        examples: [
          {
            code: `<ContentBox>
  <SectionTitle>WELCOME</SectionTitle>
  <TextPanel variant="intro">The default cyan panel.</TextPanel>
</ContentBox>`,
            render: (
              <ContentBox>
                <SectionTitle>WELCOME</SectionTitle>
                <TextPanel variant="intro">The default cyan panel.</TextPanel>
              </ContentBox>
            ),
          },
          {
            title: 'Variants',
            code: `<ContentBox variant="highlight" pulse>…</ContentBox>
<ContentBox variant="gold">…</ContentBox>`,
            render: (
              <>
                <ContentBox variant="highlight">
                  <SectionTitle>HIGHLIGHT</SectionTitle>
                </ContentBox>
                <ContentBox variant="gold">
                  <SectionTitle>GOLD</SectionTitle>
                </ContentBox>
              </>
            ),
          },
        ],
      },
      {
        name: 'RainbowBar',
        slug: 'rainbow-bar',
        summary: 'The animated seven-stop divider.',
        props: ['RainbowBarProps'],
        accessibility: 'Purely decorative, so it is aria-hidden.',
        examples: [
          {
            code: `<RainbowBar />
<RainbowBar height={20} speed={1.5} />`,
            render: (
              <>
                <RainbowBar />
                <RainbowBar height={20} speed={1.5} />
              </>
            ),
          },
        ],
      },
      {
        name: 'SiteHeader',
        slug: 'site-header',
        summary: 'Purple-gradient header, rainbow-barred at both ends.',
        props: ['SiteHeaderProps'],
        examples: [
          {
            code: `<SiteHeader subtitle="🌟 The MOST AWESOME conference 🌟">
  <GlowingTitle>✨ RETRO CONF ✨</GlowingTitle>
</SiteHeader>`,
            render: (
              <SiteHeader subtitle="🌟 The MOST AWESOME conference in the universe 🌟">
                <GlowingTitle>✨ RETRO CONF ✨</GlowingTitle>
              </SiteHeader>
            ),
          },
        ],
      },
      {
        name: 'SiteFooter',
        slug: 'site-footer',
        summary: 'Matching gradient footer.',
        props: ['SiteFooterProps'],
        examples: [
          {
            code: `<SiteFooter>
  <BadgeRow><Badge>GeoCities Certified™</Badge></BadgeRow>
</SiteFooter>`,
            render: (
              <SiteFooter>
                <BadgeRow>
                  <Badge>GeoCities Certified™</Badge>
                  <Badge variant="silver">HTML 4.0!</Badge>
                </BadgeRow>
              </SiteFooter>
            ),
          },
        ],
      },
    ],
  },
  {
    title: 'Typography',
    description: 'Text treatments, and the marquee that replaces a dead element.',
    items: [
      {
        name: 'Marquee',
        slug: 'marquee',
        summary:
          'A replacement for the obsolete <marquee> element, on transforms.',
        description:
          '<marquee> was removed from the HTML standard and browsers may drop it at any time. This reimplements the behaviours people actually used, and adds two the real element never had: it reflows when the container or content resizes, and it can be paused.',
        props: ['MarqueeProps'],
        accessibility:
          'pauseOnHover is on by default. WCAG 2.2.2 requires a mechanism to stop motion that starts automatically and runs for more than five seconds, which describes every marquee ever written. Under prefers-reduced-motion the track stops and the content wraps in place, so it stays readable rather than sitting off-screen.',
        examples: [
          // `alternate` leads because its content is always on screen. A
          // `scroll` marquee spends part of its cycle off-frame, which makes a
          // poor first impression on someone who has just landed on the page.
          {
            title: 'Alternate — bounces between the edges',
            code: `<Marquee behavior="alternate" scrollAmount={3}>
  ⚡ BEST VIEWED IN NETSCAPE NAVIGATOR 4.0+ ⚡
</Marquee>`,
            render: (
              <Marquee behavior="alternate" scrollAmount={3}>
                ⚡ BEST VIEWED IN NETSCAPE NAVIGATOR 4.0+ ⚡
              </Marquee>
            ),
            note: 'hover to pause',
            dark: true,
          },
          {
            title: 'Scroll — travels edge to edge, then wraps',
            code: `<Marquee behavior="scroll" direction="left" scrollAmount={6}>
  🌟 The MOST AWESOME conference in the universe! 🌟
</Marquee>`,
            render: (
              <Marquee behavior="scroll" direction="left" scrollAmount={6}>
                🌟 The MOST AWESOME conference in the universe! 🌟
              </Marquee>
            ),
            dark: true,
          },
          {
            title: 'Slide — enters once and stops',
            code: `<Marquee behavior="slide" scrollAmount={8}>Arrives, then stays put.</Marquee>`,
            render: (
              <Marquee behavior="slide" scrollAmount={8}>
                Arrives, then stays put.
              </Marquee>
            ),
            dark: true,
          },
        ],
        related: ['blink'],
      },
      {
        name: 'GlowingTitle',
        slug: 'glowing-title',
        summary: 'The five-layer neon page title.',
        props: ['GlowingTitleOwnProps'],
        examples: [
          {
            code: `<GlowingTitle>✨ RETRO CONF ✨</GlowingTitle>
<GlowingTitle as="h2" pulse={false}>No pulse</GlowingTitle>`,
            render: <GlowingTitle>✨ RETRO CONF ✨</GlowingTitle>,
            dark: true,
          },
        ],
      },
      {
        name: 'SectionTitle',
        slug: 'section-title',
        summary: 'Magenta heading with a hard offset shadow.',
        props: [],
        examples: [
          {
            code: `<SectionTitle>IMPORTANT DATES</SectionTitle>`,
            render: <SectionTitle>IMPORTANT DATES</SectionTitle>,
          },
        ],
      },
      {
        name: 'Blink',
        slug: 'blink',
        summary: 'Blinking text — the <blink> element’s spiritual successor.',
        description:
          'The resting state is deliberately opacity: 1. When the reduced-motion policy strips the animation the text stays readable — the original site’s keyframes ended at opacity: 0, so disabling them left the text permanently invisible.',
        props: ['BlinkOwnProps'],
        accessibility:
          'Disabled entirely under prefers-reduced-motion, resting visible. Flashing content is a seizure risk above 3Hz; the default 1s cycle is well under that, and speed should not be pushed below roughly 0.7s.',
        examples: [
          {
            code: `<Blink>UNDER CONSTRUCTION</Blink>
<Blink speed={2}>Slower</Blink>`,
            render: (
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                <Blink>UNDER CONSTRUCTION</Blink>
              </span>
            ),
            dark: true,
          },
        ],
      },
      {
        name: 'RainbowText',
        slug: 'rainbow-text',
        summary: 'Per-character rainbow with a travelling wave.',
        props: ['RainbowTextProps'],
        accessibility:
          'Splitting a word into one span per letter makes some screen readers spell it out. The full string is also rendered into a visually hidden span and the decorative letters hidden, so it is announced as a word.',
        examples: [
          {
            code: `<RainbowText>WELCOME</RainbowText>`,
            render: (
              <span style={{ fontSize: 32, fontWeight: 'bold' }}>
                <RainbowText>WELCOME</RainbowText>
              </span>
            ),
            dark: true,
          },
        ],
      },
      {
        name: 'Highlight',
        slug: 'highlight',
        summary: 'Yellow-on-red inline emphasis. Renders a <mark>.',
        props: [],
        examples: [
          {
            code: `An <Highlight>INCLUSIVE</Highlight> conference.`,
            render: (
              <TextPanel variant="intro">
                An <Highlight>INCLUSIVE</Highlight> non-profit conference.
              </TextPanel>
            ),
          },
        ],
      },
      {
        name: 'RetroLink',
        slug: 'retro-link',
        summary: 'Blue, underlined, purple once visited.',
        props: ['RetroLinkProps'],
        accessibility:
          'external adds rel="noopener noreferrer" alongside target="_blank". The original site used target="_blank" on eighteen links without it, handing each opened page a reference back.',
        examples: [
          {
            code: `<RetroLink href="https://example.com" external>Offsite link</RetroLink>`,
            render: (
              <TextPanel variant="intro">
                Visit our{' '}
                <RetroLink href="https://example.com" external>
                  sponsor page
                </RetroLink>
                .
              </TextPanel>
            ),
          },
        ],
      },
      {
        name: 'TextPanel',
        slug: 'text-panel',
        summary: 'Translucent panel keeping dark text legible over the starfield.',
        props: ['TextPanelOwnProps'],
        examples: [
          {
            code: `<TextPanel variant="intro">Large body panel.</TextPanel>
<TextPanel variant="fun">Dashed aside.</TextPanel>
<TextPanel variant="note">Small italic caveat.</TextPanel>`,
            render: (
              <>
                <TextPanel variant="intro">Large body panel.</TextPanel>
                <TextPanel variant="fun">Dashed aside.</TextPanel>
                <TextPanel variant="note">Small italic caveat.</TextPanel>
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    title: 'Banners',
    description: 'The furniture that opened every self-respecting page.',
    items: [
      {
        name: 'BrowserBanner',
        slug: 'browser-banner',
        summary: 'The rainbow “best viewed in…” strip.',
        props: ['BrowserBannerProps'],
        examples: [
          {
            code: `<BrowserBanner preset="netscape" />
<BrowserBanner preset="resolution" icon="🖥️" />`,
            render: (
              <>
                <BrowserBanner preset="netscape" />
                <BrowserBanner preset="resolution" icon="🖥️" />
              </>
            ),
          },
        ],
      },
      {
        name: 'FlashBanner',
        slug: 'flash-banner',
        summary: 'A tribute to the Flash splash banner.',
        description:
          'Entirely CSS and DOM — no plugin, no .swf, and no security advisories.',
        props: ['FlashBannerProps'],
        examples: [
          {
            code: `<FlashBanner
  title="RETRO CONF 2026"
  subtitle="★ THE ULTIMATE DEVELOPER CONFERENCE ★"
/>`,
            render: (
              <FlashBanner
                title="RETRO CONF 2026"
                subtitle="★ THE ULTIMATE DEVELOPER CONFERENCE ★"
              />
            ),
          },
        ],
      },
      {
        name: 'ConstructionBanner',
        slug: 'construction-banner',
        summary: '“Under construction” — the internet’s longest-running status.',
        props: ['ConstructionBannerProps'],
        examples: [
          {
            code: `<ConstructionBanner />`,
            render: <ConstructionBanner />,
          },
        ],
      },
      {
        name: 'WebRing',
        slug: 'web-ring',
        summary: 'A web ring — the pre-search-engine way sites found each other.',
        description:
          'The original rendered its controls as <a href="#">, which look like buttons but navigate. These are real buttons when given handlers and real links when given hrefs.',
        props: ['WebRingProps'],
        examples: [
          {
            code: `<WebRing
  name="MELBOURNE TECH WEB RING"
  members={['NDC Melbourne', 'YOW! Conference', 'DDD Perth']}
  onPrevious={goPrev}
  onRandom={goRandom}
  onNext={goNext}
/>`,
            render: (
              <ContentBox variant="gold">
                <WebRing
                  name="MELBOURNE TECH WEB RING"
                  description="This site is part of the ULTRA COOL ring!"
                  members={['NDC Melbourne', 'YOW! Conference', 'DDD Perth']}
                  onPrevious={() => {}}
                  onRandom={() => {}}
                  onNext={() => {}}
                />
              </ContentBox>
            ),
          },
        ],
      },
    ],
  },
  {
    title: 'Controls',
    description: 'Buttons and navigation.',
    items: [
      {
        name: 'CoolButton',
        slug: 'cool-button',
        summary: 'The tilted, bevelled call-to-action.',
        description:
          'Polymorphic: renders an <a> when given an href and a <button> otherwise, so keyboard behaviour stays correct either way.',
        props: ['CoolButtonOwnProps'],
        accessibility:
          'float animates the button continuously, which makes it a moving target — harder to hit with a mouse and materially harder with a motor impairment. The animation now cancels on hover and focus, but float is still the wrong choice for a primary action.',
        examples: [
          {
            code: `<CoolButton>CLICK ME</CoolButton>
<CoolButton variant="gold" size="lg">GOLD</CoolButton>
<CoolButton variant="diamond">DIAMOND</CoolButton>
<CoolButton href="/agenda">A LINK</CoolButton>
<CoolButton disabled>DISABLED</CoolButton>`,
            render: (
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <CoolButton>CLICK ME</CoolButton>
                <CoolButton variant="gold">GOLD</CoolButton>
                <CoolButton variant="diamond">DIAMOND</CoolButton>
                <CoolButton variant="grass" size="sm">
                  SMALL
                </CoolButton>
                <CoolButton disabled>DISABLED</CoolButton>
              </div>
            ),
          },
        ],
      },
      {
        name: 'NavBar',
        slug: 'nav-bar',
        summary: 'Row of chunky bevelled navigation buttons.',
        props: ['NavBarProps', 'NavButtonOwnProps'],
        accessibility:
          'active sets aria-current="page". A disabled link gets aria-disabled, since the disabled attribute does nothing on an <a>.',
        examples: [
          {
            code: `<NavBar label="Agenda years">
  <NavButton href="/">🏠 HOME</NavButton>
  <NavButton href="/agenda" active>📅 2025</NavButton>
  <NavButton href="#" disabled>⏭️ 2026</NavButton>
</NavBar>`,
            render: (
              <NavBar label="Example">
                <NavButton href="#">🏠 HOME</NavButton>
                <NavButton href="#" active>
                  📅 2025
                </NavButton>
                <NavButton href="#" disabled>
                  ⏭️ 2026
                </NavButton>
              </NavBar>
            ),
          },
        ],
      },
      {
        name: 'FooterLinks',
        slug: 'footer-links',
        summary: 'Pipe-separated footer navigation.',
        props: ['FooterLinksProps'],
        examples: [
          {
            code: `<FooterLinks
  links={[
    { label: '🏠 HOME', href: '/' },
    { label: '📅 AGENDA', href: '/agenda' },
    { label: '🌙 BY NIGHT', href: 'https://example.com', external: true },
  ]}
/>`,
            render: (
              <SiteFooter rainbowBars={false}>
                <FooterLinks
                  links={[
                    { label: '🏠 HOME', href: '#' },
                    { label: '📅 AGENDA', href: '#' },
                    { label: '🌙 BY NIGHT', href: '#', external: true },
                  ]}
                />
              </SiteFooter>
            ),
          },
        ],
      },
    ],
  },
  {
    title: 'Data display',
    description: 'Dates, badges, counters and colour keys.',
    items: [
      {
        name: 'DateList',
        slug: 'date-list',
        summary: 'Responsive grid of key-date cards.',
        props: ['DateListProps', 'DateItemProps'],
        examples: [
          {
            code: `<DateList>
  <DateItem day="SAT" date="FEB 21" title="🎊 Conference Day 🎊"
    detail="09:00 AM" dateTime="2026-02-21T09:00" />
</DateList>`,
            render: (
              <DateList>
                <DateItem
                  day="SAT"
                  date="FEB 21"
                  title="🎊 Conference Day 🎊"
                  detail="09:00 AM — The BIG day arrives!"
                  dateTime="2026-02-21T09:00"
                />
                <DateItem
                  day="TUE"
                  date="JUL 15"
                  title="🎟️ Tickets Open"
                  detail="11:00 AM"
                  dateTime="2026-07-15T11:00"
                />
              </DateList>
            ),
          },
        ],
      },
      {
        name: 'Badge',
        slug: 'badge',
        summary: 'Bevelled award chips.',
        props: ['BadgeProps', 'BadgeRowProps'],
        examples: [
          {
            code: `<BadgeRow>
  <Badge>GeoCities Certified™</Badge>
  <Badge variant="silver">HTML 4.0!</Badge>
  <Badge variant="dark">Est. 1999*</Badge>
</BadgeRow>`,
            render: (
              <BadgeRow>
                <Badge>GeoCities Certified™</Badge>
                <Badge variant="silver">HTML 4.0!</Badge>
                <Badge variant="dark">Est. 1999*</Badge>
              </BadgeRow>
            ),
          },
        ],
      },
      {
        name: 'VisitorCounter',
        slug: 'visitor-counter',
        summary: 'The hit counter. Black panel, green bevel, red Courier digits.',
        props: ['VisitorCounterProps'],
        accessibility:
          'The number sits in an aria-live="polite" region, so a change is announced once rather than the reader re-reading six digits every tick.',
        examples: [
          {
            code: `<VisitorCounter count={123456} />`,
            render: <VisitorCounter count={123456} />,
          },
        ],
        related: ['use-visitor-counter'],
      },
      {
        name: 'Legend',
        slug: 'legend',
        summary: 'Key explaining a schedule’s colour coding.',
        description:
          'The original stylesheet defined every rule for this and never rendered it, so the agenda shipped with five meaningful colours and nothing to say what they meant.',
        props: ['LegendProps', 'LegendItemProps'],
        examples: [
          {
            code: `<Legend>
  <LegendItem swatch="linear-gradient(135deg,#ffccbc,#ff8a65)" label="Keynote" />
  <LegendItem swatch="linear-gradient(135deg,#fff9c4,#fff59d)" label="Lightning" />
</Legend>`,
            render: (
              <Legend>
                <LegendItem
                  swatch="linear-gradient(135deg,#ffccbc,#ff8a65)"
                  label="Keynote"
                />
                <LegendItem
                  swatch="linear-gradient(135deg,#fff9c4,#fff59d)"
                  label="Lightning talk"
                />
                <LegendItem
                  swatch="linear-gradient(135deg,#81c784,#66bb6a)"
                  label="All-hands"
                />
              </Legend>
            ),
          },
        ],
      },
    ],
  },
  {
    title: 'Sponsors',
    description: 'Tiered sponsor grids and a full-width title-sponsor unit.',
    items: [
      {
        name: 'SponsorTier',
        slug: 'sponsor-tier',
        summary: 'A titled band of sponsor cards, skinned by tier.',
        props: ['SponsorTierProps', 'SponsorGridProps', 'SponsorCardProps'],
        examples: [
          {
            code: `<SponsorTier tier="gold" title="🥇 GOLD SPONSORS 🥇">
  <SponsorGrid>
    <SponsorCard name="Widget Corp" tier="gold" hoverText="★ CLICK ME! ★" />
  </SponsorGrid>
</SponsorTier>`,
            render: (
              <>
                <SponsorTier tier="diamond" title="💎 DIAMOND 💎">
                  <SponsorGrid single>
                    <SponsorCard
                      name="Diamond Co"
                      tier="diamond"
                      hoverText="★ CLICK ME! ★"
                    />
                  </SponsorGrid>
                </SponsorTier>
                <SponsorTier tier="gold" title="🥇 GOLD 🥇">
                  <SponsorGrid>
                    <SponsorCard name="Widget Corp" tier="gold" />
                    <SponsorCard name="Sprocket Ltd" tier="gold" />
                  </SponsorGrid>
                </SponsorTier>
              </>
            ),
          },
        ],
      },
      {
        name: 'ServiceSponsorSection',
        slug: 'service-sponsor-section',
        summary: 'Dashed sub-group for sponsors of a specific service.',
        props: ['ServiceSponsorSectionProps'],
        examples: [
          {
            code: `<ServiceSponsorSection category="☕ Coffee Cart by:">
  <SponsorGrid>
    <SponsorCard name="Bean Co" tier="silver" />
  </SponsorGrid>
</ServiceSponsorSection>`,
            render: (
              <ServiceSponsorSection category="☕ Coffee Cart by:">
                <SponsorGrid>
                  <SponsorCard name="Bean Co" tier="silver" />
                  <SponsorCard name="Roast Co" tier="silver" />
                </SponsorGrid>
              </ServiceSponsorSection>
            ),
          },
        ],
      },
      {
        name: 'TitleSponsorBanner',
        slug: 'title-sponsor-banner',
        summary: 'Full-width ad unit with a glowing wordmark and badge row.',
        description:
          'Generalised from the site’s single hard-coded sponsor so it can carry any brand — every colour is driven by accentColor. The call to action now actually blinks; the original animated a keyframe name that was never defined.',
        props: ['TitleSponsorBannerProps', 'TitleSponsorTierProps'],
        examples: [
          {
            code: `<TitleSponsorBanner
  logo="ACME"
  sublogo="WIDGETS INC"
  tagline="⚡ Industry-Leading Widgets ⚡"
  cta="★ CLICK HERE ★"
  details="to visit acme.example"
  badges={['🇦🇺 Made Locally', '🏆 Award Winning']}
  accentColor="#cc0000"
  href="https://example.com"
/>`,
            render: (
              <TitleSponsorBanner
                logo="ACME"
                sublogo="WIDGETS INC"
                tagline="⚡ Industry-Leading Widget Solutions ⚡ Since 1974 ⚡"
                cta="★ CLICK HERE ★"
                details="to visit acme.example"
                badges={['🇦🇺 Made Locally', '🏆 Award Winning']}
                accentColor="#cc0000"
                accentBright="#ff3333"
                accentDark="#990000"
              />
            ),
            dark: true,
          },
        ],
      },
    ],
  },
  {
    title: 'Schedule',
    description: 'The conference grid — a real table, with real table semantics.',
    items: [
      {
        name: 'ScheduleTable',
        slug: 'schedule-table',
        summary: 'Horizontally scrolling, bevelled conference grid.',
        description:
          'The 90s used tables for page layout, which was wrong. A conference schedule is one of the few places a table was always right, so this keeps the look and fixes the semantics.',
        props: [
          'ScheduleTableProps',
          'ScheduleHeaderProps',
          'ScheduleRowProps',
          'ScheduleCellProps',
          'TimeCellProps',
        ],
        accessibility:
          'Time cells are <th scope="row"> and track names <th scope="col">, so a screen reader announces “10:15, Swanston Room” when the user lands on a session. The scroll container is focusable with a region label, so it can be reached by keyboard.',
        examples: [
          {
            code: `<ScheduleTable caption="Conference schedule">
  <ScheduleHeader tracks={['🎪 MAIN HALL', '🏛️ SWANSTON']} />
  <tbody>
    <ScheduleRow>
      <TimeCell time="10:15" duration="(45 min.)" />
      <ScheduleCell track={1}><SessionCard title="A talk" speaker="A speaker" /></ScheduleCell>
      <ScheduleCell track={2}><SessionCard title="Another" speaker="Someone" /></ScheduleCell>
    </ScheduleRow>
  </tbody>
</ScheduleTable>`,
            render: (
              <ScheduleTable caption="Conference schedule">
                <ScheduleHeader tracks={['🎪 MAIN HALL', '🏛️ SWANSTON']} />
                <tbody>
                  <ScheduleRow>
                    <TimeCell time="10:15" duration="(45 min.)" />
                    <ScheduleCell track={1}>
                      <SessionCard
                        title="Event Storming"
                        speaker="A speaker"
                      />
                    </ScheduleCell>
                    <ScheduleCell track={2}>
                      <SessionCard
                        variant="lightning"
                        title="⚡ Lightning talk"
                        speaker="Someone else"
                      />
                    </ScheduleCell>
                  </ScheduleRow>
                </tbody>
              </ScheduleTable>
            ),
          },
        ],
      },
      {
        name: 'SessionCard',
        slug: 'session-card',
        summary: 'A single talk, with keynote and lightning variants.',
        description:
          'When onSelect is supplied the card becomes a real <button>. The original put cursor: pointer on a plain <div> — clickable by mouse, invisible to a keyboard.',
        props: ['SessionCardProps'],
        examples: [
          {
            code: `<SessionCard title="A talk" speaker="A speaker" />
<SessionCard variant="keynote" title="🎯 Keynote" speaker="…" onSelect={open} />
<SessionCard variant="lightning" title="⚡ Lightning" speaker="…" />`,
            render: (
              <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
                <SessionCard title="Standard session" speaker="A speaker" />
                <SessionCard
                  variant="keynote"
                  title="🎯 Keynote session"
                  speaker="A keynote speaker"
                  location="📍 Main Hall"
                />
                <SessionCard
                  variant="lightning"
                  title="⚡ Lightning talk"
                  speaker="A brisk speaker"
                />
              </div>
            ),
          },
        ],
      },
    ],
  },
  {
    title: 'Forms & quiz',
    description:
      'The only components not extracted from the original site — it had no form controls at all.',
    items: [
      {
        name: 'AnswerList',
        slug: 'answer-list',
        summary: 'A single-choice answer group built on native radios.',
        isNew: true,
        description:
          'Built on real <input type="radio"> elements inside a <fieldset>. The inputs are visually hidden but never removed from the accessibility tree, so roving focus, arrow-key navigation and group semantics come from the platform rather than being approximated with divs and key handlers.',
        props: ['AnswerListProps'],
        accessibility:
          'Grading is never signalled by colour alone: each graded option also gets a mark glyph and a visually hidden sentence saying whether it was right, wrong, or the answer that should have been chosen.',
        examples: [
          {
            code: `<AnswerList
  legend="Pods sit in Pending. What do you check first?"
  options={options}
  value={selected}
  onChange={setSelected}
/>`,
            render: (
              <AnswerList
                legend="Pods sit in Pending. What do you check first?"
                options={SAMPLE_OPTIONS}
              />
            ),
            note: 'try the arrow keys',
          },
          {
            title: 'Graded',
            code: `<AnswerList
  legend="…" disabled value="b"
  options={[
    { id: 'a', children: '…', state: 'revealed' },
    { id: 'b', children: '…', state: 'incorrect' },
    { id: 'c', children: '…', state: 'muted' },
  ]}
/>`,
            render: (
              <AnswerList
                legend="Graded example"
                disabled
                value="b"
                options={[
                  { ...SAMPLE_OPTIONS[0]!, state: 'revealed' },
                  { ...SAMPLE_OPTIONS[1]!, state: 'incorrect' },
                  { ...SAMPLE_OPTIONS[2]!, state: 'muted' },
                ]}
              />
            ),
          },
        ],
        related: ['feedback-panel', 'progress-meter'],
      },
      {
        name: 'ProgressMeter',
        slug: 'progress-meter',
        summary: 'The segmented block bar of a 90s file-copy dialog.',
        isNew: true,
        props: ['ProgressMeterProps'],
        accessibility:
          'A real role="progressbar" with aria-valuenow, -min and -max, so the position is exposed rather than being decorative blocks.',
        examples: [
          {
            code: `<ProgressMeter value={5} max={12} label="Question 5 of 12" />`,
            render: (
              <>
                <ProgressMeter value={0} max={12} label="Not started" />
                <ProgressMeter value={5} max={12} label="Question 5 of 12" />
                <ProgressMeter value={12} max={12} label="Complete" />
              </>
            ),
            dark: true,
          },
        ],
      },
      {
        name: 'FeedbackPanel',
        slug: 'feedback-panel',
        summary: 'Right/wrong verdict with explanation and a reference link.',
        isNew: true,
        props: ['FeedbackPanelProps'],
        accessibility:
          'role="status" announces the result without moving focus — the reader is told the outcome but keeps their place.',
        examples: [
          {
            code: `<FeedbackPanel
  correct={false}
  explanation="Pending means the scheduler cannot place the pod…"
  reference={{ label: 'Kubernetes — Scheduling', url: 'https://kubernetes.io/…' }}
/>`,
            render: (
              <>
                <FeedbackPanel
                  correct
                  explanation="Right — start with why the scheduler cannot place the pod."
                />
                <FeedbackPanel
                  correct={false}
                  explanation="Raising a CPU limit makes placement harder, not easier."
                  reference={{
                    label: 'Kubernetes — Scheduling',
                    url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/',
                  }}
                />
              </>
            ),
          },
        ],
      },
      {
        name: 'ScorePanel',
        slug: 'score-panel',
        summary: 'Final score, grade and a per-category breakdown.',
        isNew: true,
        props: ['ScorePanelProps'],
        examples: [
          {
            code: `<ScorePanel
  score={9}
  total={12}
  breakdown={[{ label: 'AKS', correct: 3, total: 3 }]}
/>`,
            render: (
              <ScorePanel
                score={9}
                total={12}
                breakdown={[
                  { label: 'AKS', correct: 3, total: 3 },
                  { label: 'Networking', correct: 2, total: 3 },
                  { label: 'Identity & RBAC', correct: 4, total: 6 },
                ]}
              />
            ),
            dark: true,
          },
        ],
      },
    ],
  },
  {
    title: 'Windows chrome',
    description: 'The dialog frame every widget in the kit sits in.',
    items: [
      {
        name: 'Window95',
        slug: 'window95',
        summary: 'A Windows 95/98 dialog frame.',
        description:
          'The original built this twice — once in the popup engine, once inline on the music player — with slightly different greys each time.',
        props: ['Window95Props', 'Win95ButtonProps'],
        accessibility:
          'The window controls are real <button>s with accessible names, not <span>s carrying click handlers.',
        examples: [
          {
            code: `<Window95 title="Untitled - Notepad" onClose={close}>
  <p>Proudly hand-coded here.</p>
  <Win95Button>OK</Win95Button>
  <Win95Button tone="go">PLAY</Win95Button>
</Window95>`,
            render: (
              <Window95 title="Untitled - Notepad" onClose={() => {}}>
                <p style={{ fontSize: 12 }}>Proudly hand-coded here.</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <Win95Button>OK</Win95Button>
                  <Win95Button>Cancel</Win95Button>
                  <Win95Button tone="go">PLAY</Win95Button>
                  <Win95Button tone="stop">MUTE</Win95Button>
                </div>
              </Window95>
            ),
          },
        ],
      },
    ],
  },
  {
    title: 'Widgets',
    description:
      'Self-contained page furniture. Several are fixed-position, so their live demos live in Storybook.',
    items: [
      {
        name: 'MidiPlayer',
        slug: 'midi-player',
        summary: 'The floating “Now Playing” panel, backed by the synth.',
        description:
          'Playback is opt-in. The original auto-played on load, which every modern browser blocks anyway — and which, when it did work, was the single most hated behaviour of the era.',
        props: ['MidiPlayerProps'],
        examples: [
          {
            code: `<MidiPlayer trackName="ddd-theme.mid" />
<MidiPlayer position="static" />`,
            render: <MidiPlayer position="static" />,
            note: 'press play — it is loud',
          },
        ],
        related: ['chiptune-engine'],
      },
      {
        name: 'DarkModeToggle',
        slug: 'dark-mode-toggle',
        summary: 'Theme switcher in Windows chrome.',
        description:
          'Two fixes over the original: its label was inverted, reading “☀️ LIGHT” while already dark; and it applied the theme by injecting fifty !important declarations at runtime. This flips one data-retro-theme attribute the token layer reads.',
        props: ['DarkModeToggleProps'],
        examples: [
          {
            code: `<DarkModeToggle />
<DarkModeToggle position="static" storageKey="my-theme" />`,
            render: <DarkModeToggle position="static" />,
            note: 'changes the whole page theme',
          },
        ],
      },
      {
        name: 'Webmaster',
        slug: 'webmaster',
        summary: 'The webmaster credit panel every page of the era had.',
        props: ['WebmasterProps'],
        examples: [
          {
            code: `<Webmaster
  name="PAT SMITH"
  titles="Keeper of the Sacred HTML • Master of the Marquee"
  email="webmaster@example.com"
/>`,
            render: (
              <ContentBox variant="highlight">
                <Webmaster
                  name="PAT SMITH"
                  titles="Keeper of the Sacred HTML • Master of the Marquee"
                  email="webmaster@example.com"
                />
              </ContentBox>
            ),
          },
        ],
      },
      {
        name: 'AdwarePopups',
        slug: 'adware-popups',
        summary: 'The popup ad engine, with ten period-accurate parody ads.',
        description:
          'This existed in the original repository but was never referenced by any page — it shipped as 260 lines of dead code. Three concessions the original did not make: it is capped so the page never becomes unescapable, it does not run at all under reduced motion, and every popup is a dialog you can dismiss with Escape.',
        props: ['AdwarePopupsProps'],
        accessibility:
          'Each popup is role="dialog" aria-modal with focus on the close button, dismissable by Escape, by the X, or by clicking outside.',
        examples: [
          {
            code: `<AdwarePopups startDelay={2000} interval={8000} maxConcurrent={3} />

// Or supply your own copy:
<AdwarePopups ads={myAds} sound={false} spawnOnCta={false} />`,
            note: 'takes over the viewport — see it in Storybook',
          },
        ],
      },
      {
        name: 'SparkleEmitter',
        slug: 'sparkle-emitter',
        summary: 'Emits sparkles at random points on screen.',
        props: ['SparkleEmitterProps'],
        examples: [
          {
            code: `<SparkleEmitter interval={3000} initialBurst={3} />`,
            note: 'fixed overlay — see it in Storybook',
          },
        ],
      },
      {
        name: 'KonamiCode',
        slug: 'konami-code',
        summary: 'Renders its children once the code is typed.',
        props: ['KonamiCodeProps', 'Maximum90sModeProps'],
        examples: [
          {
            code: `<KonamiCode onActivate={celebrate}>
  <Maximum90sMode duration={10} />
</KonamiCode>`,
            note: '↑ ↑ ↓ ↓ ← → ← → B A',
          },
        ],
      },
    ],
  },
  {
    title: 'Mascots',
    description:
      'Three creatures, zero image files — divs, gradients and border-radius.',
    items: [
      {
        name: 'FlyingSquirrel',
        slug: 'flying-squirrel',
        summary: 'A flying squirrel gliding across the top of the page.',
        description:
          'Fourteen divs: head, two ears, eye, nose, torso, two gliding membranes, two paws, tail and a ground shadow.',
        props: ['FlyingSquirrelProps'],
        accessibility:
          'Purely decorative, so it is aria-hidden and does not render at all under reduced motion.',
        examples: [
          {
            code: `<FlyingSquirrel duration={8} trackHeight={80} />`,
            note: 'fixed to the top of the viewport — see it in Storybook',
          },
        ],
      },
      {
        name: 'NarwhalFlyby',
        slug: 'narwhal-flyby',
        summary: 'A narwhal arcing across the screen with a caped rider.',
        description:
          'The original hung a global window.narwhalNow() off the page to trigger one. This takes a ref instead.',
        props: ['NarwhalFlybyProps'],
        examples: [
          {
            code: `const narwhal = useRef<NarwhalFlybyHandle>(null);

<NarwhalFlyby ref={narwhal} interval={180000} />
<button onClick={() => narwhal.current?.fly()}>Launch</button>`,
            note: 'full-viewport animation — see it in Storybook',
          },
        ],
      },
      {
        name: 'UnicornCursor',
        slug: 'unicorn-cursor',
        summary: 'A unicorn chasing the pointer with a rainbow trail.',
        description:
          'Positions are written straight to the DOM in a requestAnimationFrame loop rather than through React state — twenty-one elements re-rendering at 60fps would be 1,260 reconciliations a second for pure decoration.',
        props: ['UnicornCursorProps'],
        examples: [
          {
            code: `<UnicornCursor emoji="🦄" trailLength={20} easing={0.12} />`,
            note: 'follows the pointer everywhere — see it in Storybook',
          },
        ],
      },
    ],
  },
  {
    title: 'Audio',
    description: 'A Web Audio engine, and the pattern format it plays.',
    items: [
      {
        name: 'ChiptuneEngine',
        slug: 'chiptune-engine',
        summary:
          '170 BPM happy hardcore: kick, snare, hi-hats, detuned saw bass, supersaw lead and square stabs.',
        description:
          'Rebuilt from the original site’s synth, which kept its entire state in module-level bindings — one AudioContext, one playing flag, one scheduler timer, all global. That made two players on a page impossible and left the context running forever after “stop”. This is an instance you create, start, stop and dispose. Timing uses lookahead scheduling, because setTimeout alone is far too jittery to sequence music.',
        props: [],
        examples: [
          {
            code: `const engine = new ChiptuneEngine({ pattern: HAPPY_HARDCORE, volume: 0.45 });

await engine.start();   // must follow a user gesture
engine.setVolume(0.2);
engine.stop();
await engine.dispose(); // releases the AudioContext`,
          },
          {
            title: 'Patterns are data',
            code: `const myPattern: ChiptunePattern = {
  name: 'My Loop',
  bpm: 140,
  bars: 4,
  melody: [[72, 0, 0.5], [74, 0.5, 0.5]],  // [midiNote, startBeat, duration]
  bass:   [[36, 0, 2]],                     // [midiNote, startBar, bars]
  chords: [{ notes: [60, 64, 67], startBar: 0, bars: 2 }],
};`,
          },
        ],
        related: ['midi-player', 'use-chiptune'],
      },
    ],
  },
];

export const ALL_COMPONENTS: ComponentEntry[] = COMPONENT_GROUPS.flatMap(
  (group) => group.items,
);

export function findComponent(slug: string): ComponentEntry | undefined {
  return ALL_COMPONENTS.find((entry) => entry.slug === slug);
}

export function groupOf(slug: string): ComponentGroup | undefined {
  return COMPONENT_GROUPS.find((group) =>
    group.items.some((item) => item.slug === slug),
  );
}
