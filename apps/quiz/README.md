# DevOps Dojo

Senior DevOps technical-interview practice — **Azure** and **Kubernetes** —
built entirely on [`retro-ui`](../../packages/retro-ui).

This app has two jobs. It is a genuinely useful revision tool, and it is the
**review surface for the UI kit**: a 48-component library is hard to review by
reading, and problems surface by being used. Everything on this page comes from
the kit.

## Run it

```bash
npm install                              # from the repo root
npm run dev   --workspace apps/quiz      # http://localhost:5173
npm run test  --workspace apps/quiz
npm run build --workspace apps/quiz
```

## The questions

37 scenario-led questions, deliberately not trivia — "pods sit in Pending after
a node-pool upgrade, what do you check first" rather than "what does kubectl
stand for". Each carries an explanation and a link to the authoritative source.

**Azure answers were checked against Microsoft Learn while writing**, and the
`reference` on each question is the page it was checked against. Kubernetes
questions cite kubernetes.io. Interview questions that are subtly wrong are
worse than no questions at all.

Categories: Identity & RBAC, Networking, Scaling, Secrets, Operations,
Workloads, Scheduling, Storage, Troubleshooting.

Adding a question means appending to `src/data/azure.ts` or
`src/data/kubernetes.ts`. The test suite enforces that every question has
unique IDs, distinct options, a `correctOptionId` that actually exists in its
options, an explanation, and an `https` reference.

## What it exercises

`RetroProvider`, `PageContainer`, `StarfieldBackground`, `SiteHeader`,
`SiteFooter`, `GlowingTitle`, `SectionTitle`, `ContentBox`, `TextPanel`,
`CoolButton`, `Badge`, `BadgeRow`, `BrowserBanner`, `Marquee`, `Blink`,
`Highlight`, `RetroLink`, `FooterLinks`, `DarkModeToggle`, `MidiPlayer`,
`SparkleEmitter`, `FlyingSquirrel` — plus the four primitives the app forced
into existence: `AnswerList`, `ProgressMeter`, `FeedbackPanel`, `ScorePanel`.

## Deployment

Built and published to GitHub Pages by `.github/workflows/pages.yml`:

- `/` — this quiz
- `/retro/` — the original DDD Melbourne 90s site, copied from `public/` with
  its absolute asset paths rewritten for static hosting. `public/` itself is
  never modified; CI asserts that.
