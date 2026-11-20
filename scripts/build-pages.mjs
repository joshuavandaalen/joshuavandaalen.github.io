#!/usr/bin/env node
/**
 * Assembles every site in the repository into one Pages artifact.
 *
 *   /            the documentation site
 *   /quiz/       the DevOps Dojo demo app
 *   /retro/      the original 1997-style site
 *   /storybook/  the component workbench
 *
 * Run after the individual builds. `--skip-storybook` is there because
 * Storybook takes ~20s to build and is not worth waiting for on every local
 * preview.
 */
import { cp, mkdir, rm, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const dist = join(repoRoot, 'dist');

const skipStorybook = process.argv.includes('--skip-storybook');

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function requireBuild(path, hint) {
  if (!(await exists(path))) {
    console.error(`ERROR: missing ${path}\n  Run: ${hint}`);
    process.exit(1);
  }
}

async function main() {
  const docsDist = join(repoRoot, 'apps/docs/dist');
  const quizDist = join(repoRoot, 'apps/quiz/dist');

  await requireBuild(docsDist, 'npm run build --workspace apps/docs');
  await requireBuild(quizDist, 'npm run build --workspace apps/quiz');

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  // Docs at the root.
  await cp(docsDist, dist, { recursive: true });

  // The docs site is a client-side router on static hosting, so an unknown
  // path has to fall back to the app shell. This is the standard GitHub Pages
  // SPA trick, and it is what makes /components/marquee a real, shareable URL.
  await cp(join(dist, 'index.html'), join(dist, '404.html'));

  await cp(quizDist, join(dist, 'quiz'), { recursive: true });

  // The retro export rewrites absolute paths in its copies; public/ is a
  // read-only input.
  spawnSync(process.execPath, [join(here, 'build-retro-site.mjs'), join(dist, 'retro')], {
    stdio: 'inherit',
  });

  const storybookDist = join(repoRoot, 'packages/retro-ui/storybook-static');
  if (!skipStorybook && (await exists(storybookDist))) {
    await cp(storybookDist, join(dist, 'storybook'), { recursive: true });
    console.log('  storybook  → /storybook/');
  } else if (!skipStorybook) {
    console.warn(
      '  storybook  → skipped (run: npm run build-storybook --workspace packages/retro-ui)',
    );
  }

  // Pages runs output through Jekyll otherwise, which drops files and folders
  // beginning with an underscore — Vite emits plenty.
  await writeFile(join(dist, '.nojekyll'), '');

  // Fail loudly rather than deploying a site with a missing section.
  const required = [
    'index.html',
    '404.html',
    'quiz/index.html',
    'retro/index.html',
    'retro/agenda.html',
  ];
  for (const file of required) {
    if (!(await exists(join(dist, file)))) {
      console.error(`ERROR: expected ${file} in the artifact`);
      process.exit(1);
    }
  }

  const shell = await readFile(join(dist, 'index.html'), 'utf8');
  if (!shell.includes('<div id="root">')) {
    console.error('ERROR: the docs shell looks wrong — no #root element');
    process.exit(1);
  }

  console.log('\nPages artifact assembled at dist/');
  console.log('  docs       → /');
  console.log('  quiz       → /quiz/');
  console.log('  retro site → /retro/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
