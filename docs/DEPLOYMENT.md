# Deployment

Everything in this repository publishes to one GitHub Pages site.

| Path | Contents | Source |
|---|---|---|
| `/` | Documentation site | `apps/docs` |
| `/quiz/` | DevOps Dojo demo app | `apps/quiz` |
| `/retro/` | The original 1997 site | `public/` (copied, never modified) |
| `/storybook/` | Component workbench | `packages/retro-ui` |

---

## One-time setup

**Pages will not deploy until its source is set to GitHub Actions.** This is a
repository setting; a workflow cannot flip it for you. Pick either:

**a) The 30-second option.**
Settings → Pages → Source → **GitHub Actions**. Done.

**b) Let the workflow do it.**
Create a personal access token with `repo` and `workflow` scope, add it as the
repository secret **`PAGES_TOKEN`**, and the next run enables Pages itself.

The default `GITHUB_TOKEN` cannot enable Pages — that is a GitHub restriction,
not a gap here. The deploy workflow detects the failure and prints these
instructions rather than dying with an opaque `Not Found`.

---

## The pipeline

Two workflows, with one shared build so the thing that gets verified is the
thing that gets published.

### `ci.yml` — every push and pull request

1. Typecheck all three workspaces
2. Unit tests (74)
3. **API reference freshness** — regenerates the props tables from the kit's
   TypeScript and fails if they differ from what is committed
4. Build kit, docs, quiz, Storybook
5. Assemble the full artifact
6. **`public/` was not modified** — it is a read-only input to the retro export
7. **The package cannot be published** — asserts `private: true`, and greps
   npm's output, because `npm publish --workspace` *skips* a private package
   and still exits 0
8. **Browser verification** — serves the artifact exactly as Pages would, then
   drives all three sites through Chromium (28 checks)
9. Uploads the artifact for download, kept 7 days

Concurrency cancels superseded runs: a commit that has already been replaced is
not worth the minutes.

### `pages.yml` — `main`, or on demand

1. Build and assemble via the shared composite action
2. **The same browser suite, before publishing.** Deploying something that has
   never been opened in a browser is how a green pipeline ships a broken site
3. Configure Pages (enabling it when `PAGES_TOKEN` is present)
4. Upload and deploy
5. **Verify the live deployment** — hits the real URLs and checks both status
   *and* body content, retrying while Pages propagates
6. Write a summary table of every deployed URL

`deploy-pages` reporting success only means the CDN accepted the artifact. Step
5 is what turns that into evidence the site works. A missing `404.html`, a wrong
base path, or Jekyll eating an underscore directory all produce a "successful"
deploy serving a broken site.

Concurrency never cancels a running publish — a half-deployed site is worse
than a slow one.

---

## Deploying a branch before merge

Actions → **Deploy** → Run workflow, and pick the branch. Useful for previewing
a large PR. It publishes to the live site, so it is a deliberate act rather
than something that happens automatically.

`skip_verification` is available for when you want the deploy without waiting
on propagation. Prefer leaving it off.

---

## Running it locally

Every step above has a local equivalent, and a VS Code task.

```bash
npm run typecheck          # all three workspaces
npm test                   # unit tests
npm run api:check          # props tables not stale
npm run build:pages        # build everything and assemble dist/
npm run serve:dist         # serve it the way Pages does, on :4173
npm run e2e                # drive it through a browser
npm run verify:deployment -- https://joshuavandaalen.github.io
```

`serve-static.mjs` mirrors Pages closely enough to test against: directory
indexes, and the `404.html` fallback that makes `/components/marquee` a real
URL. Testing against `vite preview` instead would miss exactly the class of bug
that only appears once deployed.

---

## Troubleshooting

**Deploy fails at "Configure Pages" with `Not Found`.**
Pages is not enabled. See one-time setup above.

**Deploy succeeds, `verify-deployment` fails on `/components/marquee`.**
The SPA fallback did not ship. `scripts/build-pages.mjs` copies `index.html` to
`404.html`; check it ran and that `dist/404.html` exists.

**Assets 404 under `/quiz/` or `/retro/`.**
`apps/quiz/vite.config.ts` must set `base: '/quiz/'`. The retro site's absolute
paths are rewritten by `scripts/build-retro-site.mjs`, which fails the build if
any survive.

**A directory beginning with `_` is missing from the deployed site.**
Jekyll processing. `build-pages.mjs` writes `.nojekyll`; confirm it is present
in the artifact.
