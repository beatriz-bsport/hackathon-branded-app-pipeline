import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { FrontmatterSchema } from "../lib/frontmatter-schema.js";
import { listContentPages } from "./lib/content-pages.mjs";
import { DOCS_ROOT } from "./lib/paths.mjs";

const GENERATED_DIR = path.join(DOCS_ROOT, "lib", "generated");
const MANIFEST_OUT = path.join(GENERATED_DIR, "pages-manifest.json");

async function main() {
  const pages = await listContentPages();
  const results = pages.map((page) => {
    const parsed = FrontmatterSchema.safeParse(page.frontmatter);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(
        `[generate-pages-manifest] invalid frontmatter in ${page.contentPath}:\n${issues}`,
      );
    }

    return {
      slug: page.slug,
      href: page.href,
      frontmatter: parsed.data,
      contentPath: page.contentPath,
    };
  });

  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(MANIFEST_OUT, JSON.stringify(results, null, 2));
  console.log(
    `[generate-pages-manifest] wrote ${path.relative(DOCS_ROOT, MANIFEST_OUT)} (${results.length} pages)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
