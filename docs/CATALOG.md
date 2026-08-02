# Site Catalog

A complete audit of everything the DDD Melbourne 90s site showcases, mapped to
its source location and to the component that now carries it in
`packages/retro-ui`.

The source is ~4,100 lines of hand-written HTML/CSS/vanilla JS across
`public/` — two pages, two stylesheets, six scripts and an Express server.
Nothing in `public/` was modified; it remains the historical reference.

**Totals:** 49 distinct features · 42 keyframe animations · 30 `<marquee>` tags ·
6 defects found.

---

## 1. Page chrome & layout

| # | Feature | Source | Component |
|---|---------|--------|-----------|
| 1 | Navy body background with 45° diagonal hatch and an inline-SVG star tile | `styles.css:183-193` | `StarfieldBackground` |
| 2 | `.stars` fixed overlay — **rendered but never animated**, despite the README advertising an "animated starfield" | `styles.css:196-204`, `index.html:34` | `StarfieldBackground twinkle` |
| 3 | 1200px centred stage | `styles.css:206-212` | `PageContainer` |
| 4 | Comic Sans MS / Chalkboard SE / Comic Neue body stack | `styles.css:184` | `--retro-font-display` |
| 5 | Purple-gradient header, 5px ridge gold | `styles.css:248-255` | `SiteHeader` |
| 6 | Purple-gradient footer, matching | `styles.css:922-928` | `SiteFooter` |
| 7 | Black panel with lime border, hosting the strapline marquee | `styles.css:291-302` | `SiteHeader subtitle` |

## 2. Banners & dividers

| # | Feature | Source | Component |
|---|---------|--------|-----------|
| 8 | "BEST VIEWED IN NETSCAPE NAVIGATOR 4.0+" — scrolling rainbow, yellow glow, 1×1 transparent-GIF spacers | `styles.css:215-231`, `index.html:54-60` | `BrowserBanner` |
| 9 | "OPTIMIZED FOR 800x600 RESOLUTION" variant | `agenda.html:56-62` | `BrowserBanner preset="resolution"` |
| 10 | 10px animated seven-stop rainbow divider | `styles.css:234-245` | `RainbowBar` |
| 11 | Fake Flash/SWF unit — shifting magenta→purple gradient, ridge gold border | `styles.css:315-325` | `FlashBanner` |
| 12 | 3D `rotateY` spinner, plus a counter-rotating variant | `styles.css:336-356` | `FlashBanner` icons |
| 13 | Bouncing title with triple chromatic-offset shadow | `styles.css:363-383` | `FlashBanner title` |
| 14 | Pulse-glow subtitle | `styles.css:385-402` | `FlashBanner subtitle` |
| 15 | "REQUIRES FLASH 8+" corner chip, Win95 outset | `styles.css:404-416` | `FlashBanner badge` |
| 16 | "Under construction" — yellow field, red dashed border, spinning 🚧, blinking marquee | `styles.css:426-453` | `ConstructionBanner` |

## 3. Typography & text effects

| # | Feature | Source | Component |
|---|---------|--------|-----------|
| 17 | 48px neon title, five-layer text-shadow, glow pulse | `styles.css:257-289` | `GlowingTitle` |
| 18 | Magenta section heading with hard yellow+black offsets | `styles.css:490-499` | `SectionTitle` |
| 19 | Blinking text, `steps(2, start)` | `styles.css:305-312` | `Blink` |
| 20 | **30 `<marquee>` elements** — scroll/alternate × left/right, scrollamount 2–7 | throughout both pages | `Marquee` |
| 21 | Yellow-on-red inline emphasis chip | `styles.css:525-531` | `Highlight` |
| 22 | Translucent intro / fun / note panels | `styles.css:514-523, 570-578, 644-651` | `TextPanel` |
| 23 | Blue → purple-visited → magenta-on-yellow-hover link | `styles.css:627-642` | `RetroLink` |
| 24 | Per-character rainbow wave | `script.js:130-154` | `RainbowText` |

## 4. Surfaces & controls

| # | Feature | Source | Component |
|---|---------|--------|-----------|
| 25 | Content panel — cyan→blue gradient, outset gold, blurred rainbow `::before` halo | `styles.css:456-478` | `ContentBox` |
| 26 | Pink→red highlight panel with breathing scale | `styles.css:480-488` | `ContentBox variant="highlight" pulse` |
| 27 | Primary button — perspective `rotateX`, float, hover flip and scale | `styles.css:543-567` | `CoolButton` |
| 28 | Green nav button with hover lift | `agenda-styles.css:15-32` | `NavButton` |
| 29 | Orange active nav state with pulse glow | `agenda-styles.css:34-43` | `NavButton active` |
| 30 | Greyed disabled nav state | `agenda-styles.css:45-54` | `NavButton disabled` |
| 31 | Yellow-on-hover footer links with pipe separators | `styles.css:960-982` | `FooterLinks` |

## 5. Data display

| # | Feature | Source | Component |
|---|---------|--------|-----------|
| 32 | Auto-fit date grid, groove magenta borders, hover scale+rotate | `styles.css:580-624` | `DateList` / `DateItem` |
| 33 | Gold bevelled award chips | `styles.css:984-999` | `Badge` / `BadgeRow` |
| 34 | Hit counter — black panel, groove lime, Courier red digits, six-digit zero-pad, `rotateY` flip on change | `styles.css:930-958`, `script.js:4-39` | `VisitorCounter` |
| 35 | Server-side counter: read → increment → write `visitors.txt` | `server.js:9-21` | `useVisitorCounter` |
| 36 | Colour key for the schedule — **defined in CSS, never rendered** | `agenda-styles.css:304-344` | `Legend` / `LegendItem` |

## 6. Sponsor system

| # | Feature | Source | Component |
|---|---------|--------|-----------|
| 37 | Five tier title skins: diamond (shine), platinum, gold, service, silver | `styles.css:658-814` | `SponsorTier` |
| 38 | Auto-fit sponsor grid, plus a single-column variant | `styles.css:816-827` | `SponsorGrid` |
| 39 | Sponsor cards in four tier skins, hover scale+rotate+border-inset | `styles.css:829-873` | `SponsorCard` |
| 40 | "★ CLICK ME! ★" blink reveal on hover | `styles.css:888-898` | `SponsorCard hoverText` |
| 41 | Dashed sub-groups for Wi-Fi / Breakfast / Childcare / Coffee | `styles.css:901-919` | `ServiceSponsorSection` |
| 42 | Title-sponsor ad unit — Impact wordmark at 18px tracking with glow, Courier sublogo, marquee tagline strip, blinking CTA, badge chips, pulsing red border | `styles.css:675-789` | `TitleSponsorBanner` |

## 7. Schedule / agenda

| # | Feature | Source | Component |
|---|---------|--------|-----------|
| 43 | Horizontally-scrolling wrapper, ridge gold, gold glow | `agenda-styles.css:62-68` | `ScheduleTable` |
| 44 | Table head — purple gradient, outset gold; magenta time column; 180px track columns | `agenda-styles.css:71-100` | `ScheduleHeader` |
| 45 | Time cell with lilac gradient, inset silver, italic duration sub-label | `agenda-styles.css:117-134` | `TimeCell` |
| 46 | Row variants — special (amber), full-width (green), changeover (grey italic), party (pink, inner-glow pulse) | `agenda-styles.css:144-209` | `ScheduleRow` |
| 47 | Five pastel track tints | `agenda-styles.css:211-230` | `ScheduleCell track` |
| 48 | Session card, groove purple, hover `rotate(-2deg) scale` — plus keynote and lightning variants | `agenda-styles.css:232-301` | `SessionCard` |
| 49 | Print stylesheet — hides chrome, forces black-on-white | `agenda-styles.css:415-434` | `@media print` in `schedule.css` |

## 8. Widgets & easter eggs

All of these were self-executing IIFEs that injected their own `<style>` block
and hung globals off `window`.

| # | Feature | Source | Component |
|---|---------|--------|-----------|
| 50 | "Now Playing" panel — Win95 grey, PLAY/MUTE toggle | `index.html:495-504` (inline styles) | `MidiPlayer` |
| 51 | **Happy-hardcore synth** — 170 BPM, kick/snare/hi-hats/detuned-saw bass/5-osc supersaw lead/square stabs, 8-bar loop, lookahead scheduler, compressor | `midi-synth.js` (252 lines) | `ChiptuneEngine`, `useChiptune` |
| 52 | Dark-mode toggle with localStorage persistence | `darkmode.js` | `DarkModeToggle` |
| 53 | Unicorn cursor follower, 20-dot tapering rainbow trail, direction flip | `unicorn.js` | `UnicornCursor` |
| 54 | Narwhal flyby with caped rider — pure-CSS creature, 4s bezier arc, every 3 min | `narwhal.js` (350 lines) | `NarwhalFlyby` |
| 55 | Flying squirrel — 14-div glider, wing flutter, tail wag, shadow pulse | `styles.css:6-175`, `index.html:13-31` | `FlyingSquirrel` |
| 56 | **Adware engine** — 10 parody ads, Win98 dialog chrome, stacked rotation, square-wave bloop, CTA spawns two more. **Never referenced by any page** | `adware.js` (260 lines) | `AdwarePopups`, `classicAds` |
| 57 | Sparkle emitter, one every 3s | `script.js:42-81` | `SparkleEmitter` |
| 58 | Konami code → Maximum 90s Mode | `script.js:92-127` | `useKonamiCode`, `Maximum90sMode` |
| 59 | Styled `console.log` easter eggs | `script.js:157-159` | *(not ported — a page concern, not a component)* |
| 60 | Web ring — PREV/RANDOM/NEXT plus member list | `index.html:426-450` (inline styles) | `WebRing` |
| 61 | Webmaster tribute panel | `index.html:399-423` (inline styles) | `Webmaster` |
| 62 | Windows 95/98 dialog chrome, built twice with differing greys | `adware.js:196-215`, `index.html:495` | `Window95`, `Win95Button` |

---

## Defects found

Catalogued during extraction. **None were patched in `public/`** — the original
stays as-is. Each is fixed in the kit's version.

| Defect | Location | Effect | Fixed by |
|--------|----------|--------|----------|
| Stray `}` after the `gradient-shift` keyframes block | `styles.css:423` | Orphaned brace at the top level of the stylesheet | Rewritten in `animations.css` |
| `.anca-blink` animates `blink`, but the keyframe is named `blink-animation` | `styles.css:769` | The title sponsor's "★ CLICK HERE ★" never blinks | `TitleSponsorBanner` uses `retro-blink` |
| `.legend-*` rules defined, no markup uses them | `agenda-styles.css:304-344` | Agenda ships five meaningful colours with no key | `Legend` component |
| `adware.js` not referenced by any HTML | `public/adware.js` | 260 lines of dead code | `AdwarePopups`, wired into a story |
| Dark mode targets `.agenda-table` | `darkmode.js:104` | Real class is `.schedule-table`; the rule never matches | Token-based theming |
| `.stars` div has no animation | `styles.css:196-204` | README's "animated starfield" is a static tile | `StarfieldBackground twinkle` |

## Behavioural changes made during extraction

Beyond the defects, these are places where faithful reproduction would have
shipped a genuinely bad component:

- **Blink resting state.** The original's keyframes ended at `opacity: 0`, so
  disabling the animation left text permanently invisible. The kit's resting
  state is visible.
- **Marquee.** `<marquee>` is obsolete and removed from the HTML standard.
  Reimplemented on transforms, with resize reflow and a pause mechanism
  (WCAG 2.2.2).
- **Autoplay music.** The original tried to auto-play on load. Playback is now
  opt-in, triggered by a user gesture — which is the only thing browsers allow
  anyway.
- **`target="_blank"` without `rel`.** Eighteen links opened new tabs while
  handing the opened page a reference back. `RetroLink external` adds
  `rel="noopener noreferrer"`.
- **Clickable divs.** Session cards had `cursor: pointer` on a plain `<div>` —
  clickable by mouse, invisible to a keyboard. `SessionCard onSelect` renders a
  real `<button>`.
- **Dark-mode label inversion.** The button read "☀️ LIGHT" while already dark,
  naming the current state in one place and the destination in another. It now
  consistently names the destination.
- **AudioContext leaks.** The synth kept one context in a module global and
  never closed it; the adware engine created a fresh one per popup and closed
  none. Both now clean up.
- **Uncleaned timers.** The sparkle emitter, narwhal and adware engines all ran
  on bare `setInterval` with no teardown. All now unmount cleanly.
- **Konami case sensitivity.** The original compared against lowercase `'b'`
  and `'a'`, so the code silently failed with caps lock on.
- **Table semantics.** The schedule had no `<caption>` and no `scope` on any
  header. Time cells are now `<th scope="row">`, tracks `<th scope="col">`.
