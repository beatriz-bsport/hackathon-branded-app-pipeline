import matter from "gray-matter";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { DOCS_ROOT } from "./paths.mjs";

export const CONTENT_DIR = path.join(DOCS_ROOT, "content");

export function slugToHref(slug) {
  if (slug.length === 0) return "/";
  return "/" + slug.join("/");
}

async function collectContentPages(section, dir, slugPrefix, results) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;

    if (entry.isDirectory()) {
      await collectContentPages(
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
    const { content, data } = matter(raw);

    results.push({
      slug,
      href: slugToHref(slug),
      filePath,
      contentPath: path.relative(CONTENT_DIR, filePath),
      source: content,
      frontmatter: data,
    });
  }
}

export async function listContentPages() {
  const results = [];
  const sections = await readdir(CONTENT_DIR, { withFileTypes: true });

  for (const section of sections) {
    if (!section.isDirectory()) continue;
    await collectContentPages(
      section.name,
      path.join(CONTENT_DIR, section.name),
      [],
      results,
    );
  }

  return results;
}
