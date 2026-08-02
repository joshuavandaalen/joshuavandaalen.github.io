# Retro UI Kit

> _Best viewed in Netscape Navigator 4.0+_

A component library for the early internet. Every component was extracted from
a working GeoCities-era site — the [DDD Melbourne 90s edition](../../public/)
that lives in this repository — rather than designed from a mood board.

Marquees, bevels, rainbow gradients, Windows 95 dialogs, a 170 BPM Web Audio
synth, three pure-CSS mascots and a popup-ad engine. Typed React components on
a token layer you can use on its own.

## Status: not published

This package is **`private`** and carries a placeholder name. It is not on npm
and cannot be published until a name is chosen and `private` is removed. The
CI workflow asserts this — a `npm publish --dry-run` that *succeeds* fails the
build.

## Install

Once released:

```bash
npm install <package-name>
```

## Use

```tsx
import {
  ContentBox,
  GlowingTitle,
  Marquee,
  RetroProvider,
  StarfieldBackground,
} from '<package-name>';
import '<package-name>/styles.css';

export function App() {
  return (
    <RetroProvider>
      <StarfieldBackground twinkle />
      <ContentBox>
        <GlowingTitle>✨ WELCOME ✨</GlowingTitle>
        <Marquee behavior="alternate">
          The MOST AWESOME website in the universe
        </Marquee>
      </ContentBox>
    </RetroProvider>
  );
}
```

### Without React

The stylesheet works standalone. Class names are BEM, prefixed `retro-`:

```html
<link rel="stylesheet" href="…/styles.css" />

<div class="retro-root">
  <div class="retro-content-box retro-content-box--halo">
    <h2 class="retro-section-title">HELLO</h2>
  </div>
</div>
```

Or take just the variables, via `…/tokens.css`, and build your own components
on the same palette, bevels and motion scale.

## Motion & accessibility

The original site ran about thirty simultaneous animation loops with no way to
stop any of them. This kit keeps every one, and disables them all under
`prefers-reduced-motion: reduce`.

```tsx
<RetroProvider forceMotion>  {/* full 1997 assault, regardless */}
```

Other things that got fixed on the way through: marquees pause on hover
(WCAG 2.2.2), the schedule is a real table with `scope` on both axes, session
cards are buttons rather than clickable divs, and blinking text stays readable
when the animation is stripped. The complete list is in
[`docs/CATALOG.md`](../../docs/CATALOG.md).

## What's in it

**Foundation** — `RetroProvider`, `useReducedMotion`, `useKonamiCode`,
`useVisitorCounter`, `useChiptune`

**Layout** — `StarfieldBackground`, `PageContainer`, `SiteHeader`,
`SiteFooter`, `RainbowBar`, `ContentBox`

**Typography** — `GlowingTitle`, `SectionTitle`, `Blink`, `RainbowText`,
`Highlight`, `RetroLink`, `TextPanel`, `Marquee`

**Banners** — `BrowserBanner`, `FlashBanner`, `ConstructionBanner`, `WebRing`

**Controls** — `CoolButton`, `NavBar`, `NavButton`, `FooterLinks`

**Data** — `DateList`, `DateItem`, `Badge`, `BadgeRow`, `VisitorCounter`,
`Legend`

**Sponsors** — `SponsorTier`, `SponsorGrid`, `SponsorCard`,
`ServiceSponsorSection`, `TitleSponsorBanner`

**Schedule** — `ScheduleTable`, `ScheduleHeader`, `ScheduleRow`,
`ScheduleCell`, `TimeCell`, `FullWidthEvent`, `ChangeoverRow`, `SessionCard`

**Chrome** — `Window95`, `Win95Button`

**Widgets** — `MidiPlayer`, `DarkModeToggle`, `AdwarePopups`, `SparkleEmitter`,
`KonamiCode`, `Maximum90sMode`, `Webmaster`

**Mascots** — `FlyingSquirrel`, `NarwhalFlyby`, `UnicornCursor`

**Audio** — `ChiptuneEngine`, `HAPPY_HARDCORE`, `midiToFrequency`

## The chiptune engine

The most reusable single thing here. A 170 BPM happy-hardcore loop —
kick, snare, hi-hats, three-oscillator detuned saw bass, five-oscillator
supersaw lead and square stab chords — sequenced with lookahead scheduling so
the loop never gaps.

```ts
const engine = new ChiptuneEngine({ pattern: HAPPY_HARDCORE, volume: 0.45 });
await engine.start();   // must follow a user gesture
engine.stop();
await engine.dispose(); // releases the AudioContext
```

Patterns are data, so you can supply your own melody, bassline and chords.

## Development

```bash
npm install                                    # from the repo root
npm run storybook   --workspace packages/retro-ui
npm run test        --workspace packages/retro-ui
npm run build       --workspace packages/retro-ui
```

Storybook is the living catalog. The **Catalog → Full Page** story rebuilds the
original homepage from components alone — if something on the source site
cannot be expressed there, the kit is missing it.

## License

MIT
