#!/usr/bin/env node
/**
 * Local static server that mimics our production CloudFront setup for the
 * saas-legacy bucket.
 *
 * The assembled build/ directory mirrors the S3 bucket layout:
 *   build/                       <- @bsport/saas-legacy build output
 *   build/studio/                <- @bsport/sm-host dist
 *   build/studio/apps/navigation-sidebar/   <- @bsport/sm-navigation-sidebar dist
 *   build/widget-proxy-bridge/   <- @bsport/widget-proxy-bridge dist
 *   build/widget-debugger/       <- @ichizen/widget-debugger src/html
 *
 * Rewrite rules mirror bsport-terraform/scripts/cloudfront_function_cdn_redirect.js:
 *   /studio(...)               -> /studio/index.html
 *   /widget-proxy-bridge(...)  -> /widget-proxy-bridge/index.html
 *   /widget-debugger(...)      -> /widget-debugger/index.html
 * ...unless the URI contains "/assets" or a "." (asset / file extension).
 *
 * SPA fallback: any other path that does not resolve to a real file is served
 * as the root /index.html (this emulates CloudFront's 403/404 error response
 * mapping to /index.html for the saas-legacy SPA).
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const BUILD_DIR = resolve(process.argv[2] || 'build');
const PORT = Number(process.env.PORT) || 8080;

const MICRO_FRONTENDS = [{ baseUri: '/studio' }];

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

const matchesMicroFrontend = (uri) =>
  MICRO_FRONTENDS.find(
    (mfe) =>
      uri.startsWith(mfe.baseUri) &&
      !uri.includes('/assets') &&
      !uri.includes('.'),
  );

const rewriteUri = (uri) => {
  const mfe = matchesMicroFrontend(uri);
  return mfe ? `${mfe.baseUri}/index.html` : uri;
};

const tryFile = async (filePath) => {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) return filePath;
  } catch {
    // ignore
  }
  return null;
};

const resolveFile = async (uri) => {
  const cleanUri = uri.split('?')[0].split('#')[0];
  const relative = cleanUri.replace(/^\/+/, '');
  const candidate = join(BUILD_DIR, relative || 'index.html');

  // Path traversal guard: keep everything inside BUILD_DIR.
  if (!candidate.startsWith(BUILD_DIR)) return null;

  const direct = await tryFile(candidate);
  if (direct) return direct;

  // Directory requests: try /<dir>/index.html.
  if (!relative.includes('.')) {
    const indexCandidate = await tryFile(join(candidate, 'index.html'));
    if (indexCandidate) return indexCandidate;
  }

  return null;
};

const handleRequest = async (req, res) => {
  try {
    const rawUri = req.url || '/';
    const uri = decodeURI(rawUri.split('?')[0].split('#')[0]);
    const rewritten = rewriteUri(uri);

    let file = await resolveFile(rewritten);

    // SPA fallback for the root app (saas-legacy): any unresolved extension-less
    // request falls back to the root index.html.
    if (!file && !uri.includes('.')) {
      file = await tryFile(join(BUILD_DIR, 'index.html'));
    }

    if (!file) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      res.end(`Not Found: ${uri}\n`);
      return;
    }

    const data = await readFile(file);
    const contentType =
      MIME_TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
    res.setHeader('content-type', contentType);
    res.setHeader('cache-control', 'no-store');
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end(`Internal Server Error\n${err?.stack || err}\n`);
  }
};

const server = createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`🚀 Serving ${BUILD_DIR}`);
  console.log(`   http://localhost:${PORT}`);
  console.log(
    `   (emulating production CloudFront rewrites for /studio, /widget-proxy-bridge, /widget-debugger)`,
  );
});
