#!/usr/bin/env node
/**
 * Copies the 90s DDD site into the Pages output under /retro.
 *
 * `public/` is treated as a read-only input. Its two HTML files carry twenty
 * absolute references (`/styles.css`, `/midi-synth.js`, `/agenda`, …) that
 * resolve against the domain root and therefore 404 one directory down. Those
 * are rewritten here, in the copies only — nothing under `public/` is ever
 * written to.
 *
 * The Express routes are gone too, so `/agenda` and `/agenda/{year}` become
 * `agenda.html`. `/api/visitors` simply 404s on a static host, and the site's
 * existing catch falls back to a hardcoded 123456 — arguably more
 * period-accurate than a real number.
 */
import { cp, readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const source = join(repoRoot, 'public');
const target = resolve(
  process.argv[2] ?? join(repoRoot, 'dist', 'retro'),
);

/** Applied in order; the first matching pattern wins for a given string. */
const REWRITES = [
  // Express served the same agenda page for every year.
  [/(href=")\/agenda\/\d+(")/g, '$1./agenda.html$2'],
  [/(href=")\/agenda(")/g, '$1./agenda.html$2'],
  // Root link back to the retro index, not to the quiz at the domain root.
  [/(href=")\/(")/g, '$1./index.html$2'],
  // Any remaining root-absolute asset reference becomes relative.
  [/((?:href|src)=")\/([A-Za-z0-9._-]+\.(?:css|js|mid|png|gif|jpg|svg))(")/g, '$1./$2$3'],
];

/** Routes the original site linked to that never existed even under Express. */
const DEAD_LINKS = [[/(href=")\/sponsorship(")/g, '$1#$2']];

async function main() {
  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true });

  const entries = await readdir(target, { withFileTypes: true });
  const pages = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => join(target, entry.name));

  let totalRewrites = 0;

  for (const page of pages) {
    const original = await readFile(page, 'utf8');
    let updated = original;

    for (const [pattern, replacement] of [...REWRITES, ...DEAD_LINKS]) {
      updated = updated.replace(pattern, replacement);
    }

    // A banner so anyone viewing source knows this is a generated copy and
    // that the canonical files live in public/.
    updated = updated.replace(
      /<head>/i,
      '<head>\n    <!-- Generated copy. Source of truth: /public in the repository. Paths were rewritten for static hosting under /retro. -->',
    );

    if (updated !== original) {
      const changed = countDifferences(original, updated);
      totalRewrites += changed;
      await writeFile(page, updated, 'utf8');
      console.log(`  rewrote ${changed} reference(s) in ${page.split('/').pop()}`);
    }
  }

  // If the rewrite silently matched nothing the deployed site would be broken
  // in a way no test would notice, so treat that as a build failure.
  const remaining = await countRemainingAbsolute(pages);
  if (remaining > 0) {
    console.error(
      `\nERROR: ${remaining} absolute reference(s) still present — they would 404 under /retro.`,
    );
    process.exit(1);
  }

  console.log(`\nRetro site staged at ${target} (${totalRewrites} rewrites).`);
}

function countDifferences(before, after) {
  const beforeRefs = before.match(/(?:href|src)="\//g)?.length ?? 0;
  const afterRefs = after.match(/(?:href|src)="\//g)?.length ?? 0;
  return beforeRefs - afterRefs;
}

async function countRemainingAbsolute(pages) {
  let count = 0;
  for (const page of pages) {
    const html = await readFile(page, 'utf8');
    count += html.match(/(?:href|src)="\/[^/]/g)?.length ?? 0;
  }
  return count;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
