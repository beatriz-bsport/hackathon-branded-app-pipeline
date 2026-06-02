import { cp, rm, stat } from "node:fs/promises";
import path from "node:path";

import { DOCS_ROOT, GENERATED_DIR } from "./lib/paths.mjs";

const REPO_ROOT = path.resolve(DOCS_ROOT, "..", "..");
const STORYBOOK_BASE_URL = process.env.VITE_STORYBOOK_BASE_URL?.trim();

const STORYBOOK_STATIC = path.join(
  REPO_ROOT,
  "packages",
  "design-system",
  "kaizen",
  "storybook",
  "storybook-static",
);

const OUT_DIR = path.join(GENERATED_DIR, "storybook");

function shouldUseLocalStorybook() {
  return (
    !STORYBOOK_BASE_URL ||
    STORYBOOK_BASE_URL === "/storybook" ||
    STORYBOOK_BASE_URL === "storybook"
  );
}

/** Workspace metadata that must not land in generated output. */
const SKIP_NAMES = new Set([
  "node_modules",
  "package.json",
  "project.json",
  "pnpm-lock.yaml",
]);

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyFiltered(srcDir, destDir) {
  await cp(srcDir, destDir, {
    recursive: true,
    filter: (src) => {
      const base = path.basename(src);
      return !SKIP_NAMES.has(base);
    },
  });
}

async function main() {
  if (!shouldUseLocalStorybook()) {
    console.log(
      `[copy-storybook-static] skipped local Storybook copy because VITE_STORYBOOK_BASE_URL=${STORYBOOK_BASE_URL}`,
    );
    return;
  }

  if (!(await exists(STORYBOOK_STATIC))) {
    console.error(
      `[copy-storybook-static] Source not found:\n  ${STORYBOOK_STATIC}\n\n` +
        `Build the unified Kaizen Storybook first:\n` +
        `  pnpm --filter @bsport/kaizen-storybook build\n`,
    );
    process.exit(1);
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await copyFiltered(STORYBOOK_STATIC, OUT_DIR);

  console.log(`[copy-storybook-static] copied → ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
