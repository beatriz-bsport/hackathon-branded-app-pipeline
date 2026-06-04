import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { DOCS_ROOT } from "./lib/paths.mjs";

const DIST_DIR = path.join(DOCS_ROOT, "dist");
const PAGES_MANIFEST = path.join(
  DOCS_ROOT,
  "lib",
  "generated",
  "pages-manifest.json",
);
const STATIC_ROUTES_OUT = path.join(DIST_DIR, "static-routes.json");

function uniqueRoutes(routes) {
  return [...new Set(routes)].sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });
}

async function main() {
  const raw = await readFile(PAGES_MANIFEST, "utf-8");
  const pages = JSON.parse(raw);
  const routes = uniqueRoutes(["/", ...pages.map((page) => page.href)]);

  await writeFile(STATIC_ROUTES_OUT, JSON.stringify({ routes }, null, 2));
  console.log(
    `[generate-static-routes] wrote ${path.relative(
      DOCS_ROOT,
      STATIC_ROUTES_OUT,
    )} (${routes.length} routes)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
