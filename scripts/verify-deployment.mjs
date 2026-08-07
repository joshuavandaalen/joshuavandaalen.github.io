#!/usr/bin/env node
/**
 * Smoke-tests a live deployment.
 *
 * `deploy-pages` reporting success only means the artifact was handed to the
 * CDN. It does not mean the site works — a missing 404 fallback, a wrong base
 * path, or Jekyll eating an underscore directory all produce a "successful"
 * deploy serving a broken site. This checks the actual URLs.
 *
 * Pages propagation is not instant, so each check retries before failing.
 *
 *   node scripts/verify-deployment.mjs https://user.github.io
 */
const BASE = (process.argv[2] ?? process.env.DEPLOY_URL ?? '').replace(/\/$/, '');

if (!BASE) {
  console.error('Usage: node scripts/verify-deployment.mjs <baseUrl>');
  process.exit(1);
}

const ATTEMPTS = Number(process.env.VERIFY_ATTEMPTS ?? 10);
const DELAY_MS = Number(process.env.VERIFY_DELAY_MS ?? 6000);

/**
 * Each check names a path, the status it must return, and a string that must
 * appear in the body — so a 200 serving the wrong page still fails.
 */
const CHECKS = [
  {
    path: '/',
    expect: 200,
    contains: 'Retro UI',
    why: 'documentation site at the root',
  },
  {
    path: '/components/marquee',
    expect: 200,
    contains: '<div id="root">',
    why: 'SPA fallback — deep links must serve the app shell, not a Pages 404',
  },
  {
    path: '/quiz/',
    expect: 200,
    contains: 'DevOps Dojo',
    why: 'quiz demo app',
  },
  {
    path: '/retro/',
    expect: 200,
    contains: 'DDD MELBOURNE',
    why: 'preserved 1997 site',
  },
  {
    path: '/retro/agenda.html',
    expect: 200,
    contains: 'schedule-table',
    why: 'retro agenda page',
  },
  {
    path: '/retro/styles.css',
    expect: 200,
    contains: '.flying-squirrel',
    why: 'retro assets resolved under the subdirectory',
  },
  {
    path: '/storybook/',
    expect: 200,
    contains: 'storybook',
    why: 'component workbench',
    optional: true,
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOnce(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'Cache-Control': 'no-cache' },
    });
    return { status: response.status, body: await response.text() };
  } finally {
    clearTimeout(timer);
  }
}

async function check(entry) {
  const url = `${BASE}${entry.path}`;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      const { status, body } = await fetchOnce(url);
      const statusOk = status === entry.expect;
      const bodyOk =
        !entry.contains ||
        body.toLowerCase().includes(entry.contains.toLowerCase());

      if (statusOk && bodyOk) {
        console.log(`  PASS  ${entry.path.padEnd(24)} ${entry.why}`);
        return true;
      }

      if (attempt === ATTEMPTS) {
        const reason = !statusOk
          ? `expected ${entry.expect}, got ${status}`
          : `body did not contain "${entry.contains}"`;
        console.log(
          `  ${entry.optional ? 'WARN' : 'FAIL'}  ${entry.path.padEnd(24)} ${reason}`,
        );
        return Boolean(entry.optional);
      }
    } catch (error) {
      if (attempt === ATTEMPTS) {
        console.log(
          `  ${entry.optional ? 'WARN' : 'FAIL'}  ${entry.path.padEnd(24)} ${error.message}`,
        );
        return Boolean(entry.optional);
      }
    }

    // Still propagating — back off and try again.
    await sleep(DELAY_MS);
  }

  return false;
}

console.log(`\nVerifying deployment at ${BASE}\n`);

let allPassed = true;
for (const entry of CHECKS) {
  const passed = await check(entry);
  allPassed = allPassed && passed;
}

if (allPassed) {
  console.log(`\n✓ Deployment verified: ${BASE}\n`);
  process.exit(0);
}

console.error(
  `\n✗ Deployment at ${BASE} is not serving correctly.\n` +
    '  The workflow published an artifact, but the live site failed these checks.\n',
);
process.exit(1);
