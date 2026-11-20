#!/usr/bin/env node
/**
 * Static file server that mirrors GitHub Pages' behaviour closely enough to
 * test against: directory indexes, and a `404.html` fallback so the docs
 * site's client-side routes resolve.
 *
 *   node scripts/serve-static.mjs [dir] [port]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mid': 'audio/midi',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const requested = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');

  // Refuse to serve outside the root — this runs on developer machines and in
  // CI, and a traversal bug here would be a genuine hole.
  const candidate = resolve(join(root, normalize(requested)));
  if (candidate !== root && !candidate.startsWith(root + sep)) {
    res.writeHead(403).end('forbidden');
    return;
  }

  let file = candidate;
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
  } catch {
    // Unknown path: serve the SPA shell, exactly as Pages serves 404.html.
    file = join(root, '404.html');
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');
  }
});

server.listen(port, () => {
  console.log(`Serving ${root} on http://localhost:${port}`);
});

// So `npm run serve:dist` in a CI step can be killed cleanly.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
