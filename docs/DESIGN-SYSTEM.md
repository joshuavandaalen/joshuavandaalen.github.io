# Retro UI — Design System

The token layer behind the component kit. Every value was measured off the
original DDD Melbourne 90s site rather than invented, so the system reproduces
that look exactly rather than approximating it.

Tokens are plain CSS custom properties under a `--retro-` prefix. That is
deliberate: it means the raw-CSS consumer path gets the identical system
without loading a byte of JavaScript, and consumers can override any value from
their own stylesheet without fighting specificity.

```css
@import 'retro-ui/tokens.css';   /* just the variables */
@import 'retro-ui/styles.css';   /* variables + every component rule */
```

---

## Principles

**1. The bevel is the brand.** `outset`, `inset`, `ridge` and `groove` are what
make a page read as 1997. Modern systems have flat borders and a shadow scale;
this one has a bevel scale, promoted to a first-class token group.

**2. Clash on purpose.** The palette is web-safe and maximally saturated. Navy
against yellow against magenta was never an accident, and the tokens do not
soften it.

**3. Motion is opt-out, not opt-in.** The original ran ~30 simultaneous
animation loops unconditionally. The kit keeps every one of them, and disables
them all under `prefers-reduced-motion` unless the page explicitly asks
otherwise. Nostalgia is not a good enough reason to make someone nauseous.

**4. Every resting state is a correct state.** Because animations can be
stripped, each animated component's un-animated appearance has to be the one
you'd want. Blinking text rests visible.

---

## Colour

### Core palette

| Token | Value | Role |
|-------|-------|------|
| `--retro-navy` | `#000080` | Page background |
| `--retro-yellow` | `#ffff00` | Titles, borders, highlights |
| `--retro-magenta` | `#ff00ff` | Section headings, accents |
| `--retro-cyan` | `#00ffff` | Subtitles |
| `--retro-lime` | `#00ff00` | Counter text, terminal accents |
| `--retro-red` | `#ff0000` | Alerts, counter digits |
| `--retro-gold` | `#ffd700` | Bevels, badges |
| `--retro-silver` | `#c0c0c0` | Windows chrome |
| `--retro-link` | `#0000ff` | Unvisited link |
| `--retro-link-visited` | `#800080` | Visited link |

### The rainbow

Seven stops — `--retro-rainbow-1` … `-7` — plus prebuilt gradients
`--retro-gradient-rainbow` and `--retro-gradient-rainbow-diagonal`. The
original repeated this ramp in four places and they had already drifted apart;
here it is defined once.

### Signature gradients

Named for their job, not their hex values.

| Token | Used for |
|-------|----------|
| `--retro-gradient-royal` | Header and footer |
| `--retro-gradient-sky` | Content panels |
| `--retro-gradient-sunset` | Highlight panels |
| `--retro-gradient-fire` | Primary buttons |
| `--retro-gradient-grass` | Navigation buttons |
| `--retro-gradient-amber` | Active navigation |
| `--retro-gradient-flash` | The Flash banner |
| `--retro-gradient-chrome` | The music player |

### Sponsor tiers

Five palettes — diamond, platinum, gold, silver, service — each with `-from`,
`-to`, `-ink` and `-card` variants.

### Schedule tracks

`--retro-track-1` … `-5`: five pastel washes that let a reader follow one room
down the grid. Plus row states: `-special`, `-full-width`, `-changeover`,
`-party`, `-time`, `-keynote`, `-lightning`.

### Windows chrome

`--retro-chrome-face`, `-light`, `-highlight`, `-shadow`, `-titlebar`. The
greys behind every dialog of the era.

---

## Typography

Four stacks, each with a distinct role:

| Token | Stack | Role |
|-------|-------|------|
| `--retro-font-display` | Comic Sans MS → Chalkboard SE → Comic Neue | Body copy, headings |
| `--retro-font-impact` | Impact → Arial Black | Wordmarks, ad titles |
| `--retro-font-mono` | Courier New | Counters, sublogos |
| `--retro-font-system` | MS Sans Serif → Tahoma | Windows chrome |
| `--retro-font-serif` | Times New Roman | Fine print |

Sizes run `--retro-text-3xs` (9px) through `--retro-text-6xl` (64px),
normalised from the seventeen ad-hoc pixel values the original used.

Letter-spacing: `--retro-tracking-wide` (3px), `-wider` (12px), `-widest`
(18px) — the last two exist because the title-sponsor wordmark needed them.

---

## Bevels

The signature of the era, and the token group this system cares most about.

Widths: `--retro-bevel-width-thin` (2px) → `-xl` (6px).

Prebuilt combinations, ready to drop into `border`:

```css
--retro-bevel-outset-gold        /* 4px outset gold — buttons, cards */
--retro-bevel-outset-gold-lg     /* 5px outset gold — content panels */
--retro-bevel-ridge-gold         /* 5px ridge gold — header, footer, table */
--retro-bevel-groove-magenta     /* 4px groove magenta — date cards */
--retro-bevel-groove-lime        /* 4px groove lime — visitor counter */
--retro-bevel-dashed-magenta     /* 3px dashed magenta — asides */
--retro-bevel-dashed-red         /* 5px dashed red — construction */
--retro-bevel-chrome-raised      /* 2px outset white — system buttons */
--retro-bevel-chrome-pressed     /* 2px inset white — pressed state */
--retro-bevel-chrome-window      /* 3px outset light grey — dialogs */
```

---

## Glows & shadows

`--retro-glow-gold`, `-gold-strong`, `-yellow`, `-cyan`, `-magenta` for box
glows. `--retro-shadow-drop`, `-drop-lg`, `-hard`, `-window` for drops.

Three text recipes:

- `--retro-text-glow` — the five-stop neon stack behind the page title.
- `--retro-text-offset` — hard yellow-and-black offsets, for section headings.
- `--retro-text-chroma` — magenta/cyan offsets, imitating print
  misregistration.

---

## Motion

Durations: `--retro-duration-instant` (0.2s) → `-glide` (8s).

Easings: `-linear`, `-in-out`, `-out`, `-blink` (`steps(2, start)`), `-bounce`
(`cubic-bezier(0.34, 1.56, 0.64, 1)`), `-arc`
(`cubic-bezier(0.25, 0.1, 0.25, 1)`).

`steps(2, start)` matters: it is what makes a blink read as a hard on/off
rather than a fade, and it is the difference between a `<blink>` tag and a
modern loading skeleton.

### The policy

One rule, last in the stylesheet:

```css
@media (prefers-reduced-motion: reduce) {
  :root:not([data-retro-force-motion]) [class*='retro-'] {
    animation: none !important;
    transition: none !important;
  }
}
```

Components whose entire purpose is movement — the mascots, the sparkle emitter,
the marquee — additionally check `useReducedMotion()` and change what they
*render*, since stopping their animation is not enough.

To opt back in:

```tsx
<RetroProvider forceMotion>
  <App />
</RetroProvider>
```

---

## Z-index ladder

The original scattered `9999` through `9999999` across six files with no
ordering rationale. Same tiers, named and comparable:

| Token | Value | Layer |
|-------|-------|-------|
| `--retro-z-base` | 1 | Page content |
| `--retro-z-decoration` | 100 | Background decoration |
| `--retro-z-sticky` | 500 | Sticky elements |
| `--retro-z-widget` | 9000 | Music player, theme toggle |
| `--retro-z-cursor` | 9500 | Cursor follower, sparkles |
| `--retro-z-mascot` | 9800 | Squirrel, narwhal |
| `--retro-z-modal` | 10000 | Popups |

---

## Theming

The light theme is a token swap on `[data-retro-theme='light']`, not an
override sheet. The original applied light mode by injecting ~50 `!important`
declarations at runtime, which meant consumers could never override it. Here,
switching themes redefines the variables and every rule follows automatically.

```tsx
<RetroProvider theme="light">…</RetroProvider>
```

or drive it yourself:

```js
document.documentElement.setAttribute('data-retro-theme', 'light');
```

---

## Using tokens without React

Every component class is available directly:

```html
<link rel="stylesheet" href="node_modules/retro-ui/dist/styles.css" />

<div class="retro-root">
  <div class="retro-container">
    <div class="retro-content-box retro-content-box--halo">
      <h2 class="retro-section-title">HELLO</h2>
      <span class="retro-blink">BLINKING</span>
    </div>
  </div>
</div>
```

Naming is BEM: `.retro-block`, `.retro-block__element`,
`.retro-block--modifier`.
