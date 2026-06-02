import matter from "gray-matter";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FrontmatterSchema } from "../lib/frontmatter-schema.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(HERE, "..");
const CONTENT_DIR = path.join(DOCS_ROOT, "content");
const GENERATED_DIR = path.join(DOCS_ROOT, "lib", "generated");
const MANIFEST_OUT = path.join(GENERATED_DIR, "pages-manifest.json");

function slugToHref(slug) {
  if (slug.length === 0) return "/";
  return "/" + slug.join("/");
}

async function collectDocsInDir(section, dir, slugPrefix, results) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;

    if (entry.isDirectory()) {
      await collectDocsInDir(
        section,
        path.join(dir, entry.name),
        [...slugPrefix, entry.name],
        results,
      );
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
    const base = entry.name.replace(/\.mdx$/, "");
    const slug =
      base === "index"
        ? [section, ...slugPrefix]
        : [section, ...slugPrefix, base];

    const filePath = path.join(dir, entry.name);
    const raw = await readFile(filePath, "utf-8");
    const { data } = matter(raw);

    const parsed = FrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const rel = path.relative(CONTENT_DIR, filePath);
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(
        `[generate-pages-manifest] invalid frontmatter in ${rel}:\n${issues}`,
      );
    }

    const relativePath = path.relative(CONTENT_DIR, filePath);

    results.push({
      slug,
      href: slugToHref(slug),
      frontmatter: parsed.data,
      contentPath: relativePath,
    });
  }
}

async function main() {
  const results = [];
  const sections = await readdir(CONTENT_DIR, { withFileTypes: true });

  for (const section of sections) {
    if (!section.isDirectory()) continue;
    await collectDocsInDir(
      section.name,
      path.join(CONTENT_DIR, section.name),
      [],
      results,
    );
  }

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
