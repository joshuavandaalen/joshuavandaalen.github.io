/**
 * Minimal assertion harness for the browser suites.
 *
 * Deliberately not a test framework: these run against a *built artifact* or a
 * *live deployment*, not against source, so they need to be startable with a
 * bare `node` and a base URL rather than a runner's config.
 */
export function createSuite(name) {
  const checks = [];

  return {
    check(label, pass, detail = '') {
      checks.push({ label, pass, detail });
      const mark = pass ? '[32mPASS[0m' : '[31mFAIL[0m';
      console.log(`  ${mark}  ${label}${pass ? '' : `  — ${detail}`}`);
    },
    get failures() {
      return checks.filter((c) => !c.pass);
    },
    summary() {
      const failed = checks.filter((c) => !c.pass);
      console.log(
        `\n${name}: ${checks.length - failed.length}/${checks.length} checks passed`,
      );
      return failed.length === 0;
    },
  };
}

/** Chromium, preferring a preinstalled browser when the runner has one. */
export async function launch(chromium) {
  const explicit = process.env.CHROMIUM_PATH;
  const candidates = [
    explicit,
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  ].filter(Boolean);

  for (const executablePath of candidates) {
    try {
      return await chromium.launch({ executablePath });
    } catch {
      // Fall through to Playwright's own managed browser.
    }
  }
  return chromium.launch();
}

/**
 * Collects console errors and failed requests, ignoring the ones that are
 * expected on a static host.
 */
export function watchForErrors(page) {
  const errors = [];
  const expected = (url) =>
    url.includes('favicon') ||
    // No Express behind a static deployment; the site's own catch handles it.
    url.includes('/api/visitors');

  page.on('pageerror', (error) => errors.push(`pageerror: ${error}`));
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      !message.text().includes('Failed to load resource')
    ) {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !expected(response.url())) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  return errors;
}
