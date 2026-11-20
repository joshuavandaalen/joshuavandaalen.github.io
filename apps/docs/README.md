# Retro UI — documentation site

The public site that introduces the component library. Served at the root of
the GitHub Pages deployment.

```bash
npm run dev   --workspace apps/docs    # http://localhost:5174
npm run build --workspace apps/docs
```

Or use the VS Code task **▶ Docs site (5174)** — every runnable site in this
repository has one.

## Why the chrome is calm

The kit looks like 1997. The site documenting it does not, on purpose: you
cannot evaluate a loud component if the page around it is also loud. The retro
aesthetic appears only inside framed preview panes.

This works because of a decision made when the kit was first extracted — its
reset is scoped to `.retro-root` and every rule is `retro-` prefixed, so both
stylesheets share a page without colliding. The end-to-end test asserts it in
both directions: a docs heading must compute to the docs font stack, and a
heading inside a preview must compute to Comic Sans.

## Props tables are generated

`scripts/extract-api.mjs` reads the kit's TypeScript source with the compiler
API and writes `src/generated/api.json` — every prop, type, JSDoc comment,
`extends` clause, and default value, with identifiers resolved back to their
literals so `scrollAmount` shows `6` rather than `PX_PER_TICK_DEFAULT`.

The output is committed, and CI runs `--check` to regenerate and fail if it
differs. Hand-written props tables go stale the first time someone renames a
prop and nothing catches it; this cannot.

```bash
node scripts/extract-api.mjs           # regenerate
node scripts/extract-api.mjs --check   # fail if stale
```

## Adding a component page

Everything is driven by `src/content/catalog.tsx`. Add an entry to the right
group with a summary, one or more examples, and the names of the prop
interfaces to render tables for:

```tsx
{
  name: 'MyComponent',
  slug: 'my-component',
  summary: 'One sentence.',
  props: ['MyComponentProps'],   // resolved from api.json
  examples: [{ code: '<MyComponent />', render: <MyComponent /> }],
  accessibility: 'Anything a consumer needs to know.',
}
```

Omit `render` for components that take over the viewport — the mascots, the
popup engine, the sparkle emitter. Those show code only and point at
Storybook, where they can run unframed.

## No dependencies

The router and the syntax highlighter are both written here rather than
installed, matching the kit's own character. The router is a history-API
wrapper; clean URLs survive static hosting because the deploy copies
`index.html` to `404.html`.
