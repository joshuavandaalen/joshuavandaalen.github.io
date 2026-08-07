#!/usr/bin/env node
/**
 * Browser verification for the whole deployed artifact.
 *
 * Runs against any base URL, so the same suite covers the locally assembled
 * `dist/` in CI *before* a deploy, and the live site *after* one. A deployment
 * that has not been driven through a real browser is not a verified
 * deployment.
 *
 *   node scripts/e2e/run.mjs [baseUrl]
 *   BASE_URL=https://example.github.io node scripts/e2e/run.mjs
 */
import { chromium } from 'playwright';

import { createSuite, launch, watchForErrors } from './harness.mjs';

const BASE = (
  process.argv[2] ??
  process.env.BASE_URL ??
  'http://localhost:4173'
).replace(/\/$/, '');

console.log(`\nVerifying ${BASE}\n`);

const browser = await launch(chromium);
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  permissions: ['clipboard-read', 'clipboard-write'],
});

let ok = true;

/* ---------------------------------------------------------------- docs --- */
{
  const suite = createSuite('Documentation site');
  console.log('Documentation site (/)');
  const page = await context.newPage();
  const errors = watchForErrors(page);

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  suite.check(
    'hero renders',
    (await page.getByRole('heading', { level: 1 }).count()) > 0,
  );
  suite.check(
    'document title is set',
    (await page.title()).includes('Retro UI'),
    await page.title(),
  );

  // The docs chrome and the kit share a page. If the kit's stylesheet ever
  // stops being scoped, this is where it shows up first.
  const docsFont = await page.evaluate(() => {
    const el = document.querySelector('.docs-hero__title');
    return el ? getComputedStyle(el).fontFamily : 'MISSING';
  });
  suite.check(
    'docs chrome is not Comic Sans',
    !/Comic Sans/i.test(docsFont),
    docsFont,
  );

  const previewFont = await page.evaluate(() => {
    const el = document.querySelector('.docs-preview__stage .retro-root');
    return el ? getComputedStyle(el).fontFamily : 'MISSING';
  });
  suite.check(
    'preview pane is Comic Sans',
    /Comic Sans/i.test(previewFont),
    previewFont,
  );

  await page.getByRole('tab', { name: 'pnpm' }).click();
  const command = await page.locator('.docs-install__cmd').innerText();
  suite.check(
    'package manager tabs switch',
    command.startsWith('pnpm add'),
    command,
  );

  await page.locator('.docs-install__copy').click();
  await page.waitForTimeout(200);
  const clipboard = await page
    .evaluate(() => navigator.clipboard.readText())
    .catch(() => '<unavailable>');
  suite.check(
    'install command copies',
    clipboard === command,
    `clipboard="${clipboard}"`,
  );

  // A deep link only resolves if the 404.html fallback shipped.
  await page.goto(`${BASE}/components/marquee`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  suite.check(
    'deep link resolves through the SPA fallback',
    (await page.getByRole('heading', { name: 'Marquee', level: 1 }).count()) > 0,
  );
  suite.check(
    'title updates per route',
    (await page.title()).startsWith('Marquee'),
    await page.title(),
  );

  const rows = await page.locator('.docs-props tbody tr').count();
  suite.check('props table is populated', rows >= 6, `${rows} rows`);

  const defaults = await page.locator('.docs-props__default').allInnerTexts();
  suite.check(
    'defaults resolved to literals',
    defaults.includes('6') && defaults.includes('85'),
    defaults.join(','),
  );

  const tabs = page.locator('.docs-preview').first().getByRole('tab');
  await tabs.nth(1).click();
  await page.waitForTimeout(200);
  suite.check(
    'code tab reveals source',
    await page.locator('.docs-preview .docs-code').first().isVisible(),
  );

  await tabs.nth(1).focus();
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(200);
  suite.check(
    'tabs respond to arrow keys',
    (await tabs.nth(0).getAttribute('aria-selected')) === 'true',
  );

  await page.locator('#docs-filter').fill('marq');
  await page.waitForTimeout(200);
  const filtered = await page.locator('.docs-sidebar__link').count();
  suite.check(
    'sidebar filter narrows the list',
    filtered > 0 && filtered < 5,
    `${filtered} links`,
  );

  if (errors.length > 0) {
    suite.check('no runtime errors', false, [...new Set(errors)].join(' | '));
  }
  ok = suite.summary() && ok;
  await page.close();
}

/* ---------------------------------------------------------------- quiz --- */
{
  const suite = createSuite('Quiz app');
  console.log('\nQuiz app (/quiz/)');
  const page = await context.newPage();
  const errors = watchForErrors(page);

  await page.goto(`${BASE}/quiz/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  suite.check(
    'start screen renders',
    (await page.getByText('SENIOR DEVOPS INTERVIEW PREP').count()) > 0,
  );

  // The radio input is visually hidden with the label over it — the accessible
  // pattern — so a click has to land on the label, as a real user's would.
  const pick = (pattern) =>
    page.locator('.retro-answer__label').filter({ hasText: pattern }).first().click();

  await pick(/Azure only/);
  await pick(/5 questions/);
  await page.getByRole('button', { name: /START THE QUIZ/ }).click();
  await page.waitForTimeout(400);

  suite.check('progress meter appears', (await page.getByRole('progressbar').count()) > 0);
  suite.check(
    'submit is disabled before choosing',
    await page.getByRole('button', { name: /SUBMIT ANSWER/ }).isDisabled(),
  );

  // Native radios, so arrow keys move within the group for free.
  await page.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowDown');
  suite.check(
    'arrow keys select within the answer group',
    await page.getByRole('radio').nth(1).isChecked(),
  );

  await page.getByRole('button', { name: /SUBMIT ANSWER/ }).click();
  await page.waitForTimeout(300);

  suite.check('feedback is announced', (await page.getByRole('status').count()) > 0);
  const feedback = await page.getByRole('status').innerText();
  suite.check(
    'feedback carries an explanation',
    feedback.length > 80,
    `${feedback.length} chars`,
  );
  suite.check(
    'answers lock after grading',
    await page.getByRole('radio').first().isDisabled(),
  );

  let answered = 1;
  for (let i = 0; i < 10; i += 1) {
    const next = page.getByRole('button', { name: /NEXT QUESTION|SEE MY SCORE/ });
    if ((await next.count()) === 0) break;
    const last = (await next.innerText()).includes('SCORE');
    await next.click();
    await page.waitForTimeout(250);
    if (last) break;
    await page.locator('.retro-answer__label').first().click();
    await page.getByRole('button', { name: /SUBMIT ANSWER/ }).click();
    await page.waitForTimeout(200);
    answered += 1;
  }

  suite.check('completed all five questions', answered === 5, `answered ${answered}`);
  const score = await page.locator('.retro-score__headline').innerText();
  suite.check('score is out of five', /\/5$/.test(score.trim()), score);

  // Layout-dependent, so only a real engine catches it: the fill span was
  // display: inline, making its width and height no-ops.
  const fill = await page.locator('.retro-score__bar-fill').first().boundingBox();
  suite.check(
    'score bars actually fill',
    Boolean(fill && fill.width > 0 && fill.height > 0),
    JSON.stringify(fill),
  );

  if (errors.length > 0) {
    suite.check('no runtime errors', false, [...new Set(errors)].join(' | '));
  }
  ok = suite.summary() && ok;
  await page.close();
}

/* --------------------------------------------------------------- retro --- */
{
  const suite = createSuite('Original 1997 site');
  console.log('\nOriginal 1997 site (/retro/)');
  const page = await context.newPage();
  const errors = watchForErrors(page);

  await page.goto(`${BASE}/retro/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  suite.check('stylesheet resolved', background === 'rgb(0, 0, 128)', background);
  suite.check(
    'mascot scripts ran',
    (await page.locator('.unicorn-follower').count()) > 0,
  );

  const agendaHref = await page
    .getByRole('link', { name: /AGENDA/ })
    .first()
    .getAttribute('href');
  suite.check(
    'absolute paths were rewritten for the subdirectory',
    agendaHref === './agenda.html',
    String(agendaHref),
  );

  // No API behind a static host, so the site's own fallback must take over.
  const counter = await page.locator('#visitor-count').innerText();
  suite.check(
    'visitor counter degrades gracefully',
    counter.trim() === '123456',
    counter,
  );

  await page.goto(`${BASE}/retro/agenda.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  suite.check(
    'agenda page loads',
    (await page.locator('.schedule-table').count()) > 0,
  );

  if (errors.length > 0) {
    suite.check('no runtime errors', false, [...new Set(errors)].join(' | '));
  }
  ok = suite.summary() && ok;
  await page.close();
}

await browser.close();

console.log(ok ? '\n✓ All suites passed.\n' : '\n✗ Verification failed.\n');
process.exit(ok ? 0 : 1);
