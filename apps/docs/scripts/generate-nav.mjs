import matter from "gray-matter";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(HERE, "..");
const CONTENT_DIR = path.join(DOCS_ROOT, "content");
const GENERATED_DIR = path.join(DOCS_ROOT, "lib", "generated");
const NAV_OUT = path.join(GENERATED_DIR, "nav.json");

async function readJson(filePath) {
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

function slugToHref(childrenBase, slugPath) {
  return `${childrenBase}/${slugPath}`.replace(/\/+/g, "/");
}

async function loadNavItem(tabDir, childrenBase, slugPath) {
  const segments = slugPath.split("/").filter(Boolean);
  const candidates = [
    path.join(tabDir, ...segments) + ".mdx",
    path.join(tabDir, ...segments, "index.mdx"),
  ];

  for (const filePath of candidates) {
    try {
      const raw = await readFile(filePath, "utf-8");
      const { data } = matter(raw);
      return {
        slug: slugPath,
        label: data.title ?? slugPath,
        href: slugToHref(childrenBase, slugPath),
        description: data.description,
      };
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
  }
  return null;
}

async function loadNavGroup(tabDir, childrenBase, entry) {
  const items = [];
  for (const slugPath of entry.items) {
    const item = await loadNavItem(tabDir, childrenBase, slugPath);
    if (item) items.push(item);
  }
  if (items.length === 0 && !entry.href) return null;
  const groupSlug = entry.href ?? items[0]?.slug.split("/")[0] ?? entry.group;
  return {
    type: "group",
    slug: groupSlug,
    label: entry.group,
    href: entry.href ? slugToHref(childrenBase, entry.href) : undefined,
    items,
  };
}

async function main() {
  const rootMeta = await readJson(path.join(CONTENT_DIR, "_meta.json"));
  const topTabs = [];

  for (const tab of rootMeta.tabs) {
    const tabDir = path.join(CONTENT_DIR, tab.key);
    const childrenBase = tab.childrenBase ?? tab.href;

    let order = [];
    try {
      order = await readJson(path.join(tabDir, "_meta.json"));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    const children = [];
    for (const entry of order) {
      if (typeof entry === "string") {
        if (entry === "index") continue;
        const item = await loadNavItem(tabDir, childrenBase, entry);
        if (item) children.push(item);
        continue;
      }
      if (typeof entry === "object" && entry !== null && "group" in entry) {
        const group = await loadNavGroup(tabDir, childrenBase, entry);
        if (group) children.push(group);
      }
    }

    topTabs.push({
      key: tab.key,
      label: tab.label,
      href: tab.href,
      childrenBase,
      children,
    });
  }

  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(NAV_OUT, JSON.stringify({ topTabs }, null, 2));
  console.log(
    `[generate-nav] wrote ${path.relative(DOCS_ROOT, NAV_OUT)} (${topTabs.length} tabs)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
