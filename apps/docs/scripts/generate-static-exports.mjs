import matter from "gray-matter";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { DOCS_ROOT, GENERATED_DIR } from "./lib/paths.mjs";

const CONTENT_DIR = path.join(DOCS_ROOT, "content");
const OUTPUT_DIR = GENERATED_DIR;

const DOCS_URL =
  process.env.DOCS_URL?.replace(/\/$/, "") ?? "https://kaizen.bsport.io";

function slugToHref(slug) {
  if (slug.length === 0) return "/";
  return "/" + slug.join("/");
}

function stripWrapper(source, tag) {
  const open = new RegExp(`<${tag}(\\s[^>]*)?>`, "g");
  const close = new RegExp(`</${tag}>`, "g");
  return source.replace(open, "").replace(close, "");
}

function mdxToMarkdown(source, frontmatter) {
  let body = source;
  body = body.replace(/<StatusBadge\s+status="([^"]+)"\s*\/>/g, "**[$1]**");
  body = body.replace(
    /<Callout(\s[^>]*)?>([\s\S]*?)<\/Callout>/g,
    (_match, attrs = "", inner = "") => {
      const type = (attrs.match(/type="([^"]+)"/)?.[1] ?? "info").toUpperCase();
      const cleaned = String(inner)
        .trim()
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
      return `> [!${type}]\n${cleaned}`;
    },
  );
  body = body.replace(/<StorybookEmbed\s+([^>]*?)\/>/g, (_m, attrs) => {
    const id = attrs.match(/id="([^"]+)"/)?.[1];
    return id
      ? `_Live example: Storybook story \`${id}\` — see the rendered docs page._`
      : "_Live example — see the rendered docs page._";
  });
  body = body.replace(
    /<Do\s+caption="([^"]+)"([^>]*)\/>/g,
    (_m, caption, rest) => {
      const figma = rest.match(/figma="([^"]+)"/)?.[1];
      return figma
        ? `**Do — ${caption}** _(Figma frame: ${figma})_`
        : `**Do — ${caption}**`;
    },
  );
  body = body.replace(
    /<Dont\s+caption="([^"]+)"([^>]*)\/>/g,
    (_m, caption, rest) => {
      const figma = rest.match(/figma="([^"]+)"/)?.[1];
      return figma
        ? `**Don't — ${caption}** _(Figma frame: ${figma})_`
        : `**Don't — ${caption}**`;
    },
  );
  body = body.replace(
    /<Do\s+caption="([^"]+)">([\s\S]*?)<\/Do>/g,
    (_m, caption) => `**Do — ${caption}**`,
  );
  body = body.replace(
    /<Dont\s+caption="([^"]+)">([\s\S]*?)<\/Dont>/g,
    (_m, caption) => `**Don't — ${caption}**`,
  );
  body = stripWrapper(body, "DoDont");
  body = body.replace(
    /<InstallTabs\s+packageName="([^"]+)"([^>]*)\/>/g,
    (_m, pkg, rest) => {
      const dev = /dev/.test(rest);
      return ["```bash", `pnpm add${dev ? " -D" : ""} ${pkg}`, "```"].join(
        "\n",
      );
    },
  );
  body = body.replace(
    /<PropsTable\s+component="([^"]+)"[^>]*\/>/g,
    (_m, name) =>
      `_Props for \`${name}\` — see the rendered docs page for the live table._`,
  );
  body = body.replace(
    /<TokenTable\s+category="([^"]+)"[^>]*\/>/g,
    (_m, category) =>
      `_Tokens for \`${category}\` — see the rendered docs page for the live table._`,
  );
  body = body.replace(
    /<TokenPalette\s+category="([^"]+)"[^>]*\/>/g,
    (_m, category) =>
      `_Color palette for \`${category}\` — see the rendered docs page for swatches and contrast._`,
  );
  body = body.replace(
    /<(?:Title|Body|Display)TypeScale[^>]*\/>/g,
    "_Type scale preview — see the rendered docs page._",
  );
  body = body.replace(
    /<TypeScale[\s\S]*?\/>/g,
    "_Type scale preview — see the rendered docs page._",
  );
  body = body.replace(/<ColorSwatch[^>]*\/>/g, (match) => {
    const tokenMatch = match.match(/token="([^"]+)"/);
    const valueMatch = match.match(/value="([^"]+)"/);
    const parts = [
      tokenMatch ? `\`${tokenMatch[1]}\`` : null,
      valueMatch ? `\`${valueMatch[1]}\`` : null,
    ]
      .filter(Boolean)
      .join(" ");
    return parts || "_Color swatch._";
  });
  body = body.replace(
    /<TokenAlias\s+from="([^"]+)"[^>]*\/>/g,
    (_m, from) => `\`${from}\``,
  );
  body = body.replace(
    /<Anatomy[^>]*\/>/g,
    "_Anatomy diagram — see the rendered docs page._",
  );
  body = body.replace(
    /<Anatomy[^>]*>([\s\S]*?)<\/Anatomy>/g,
    "_Anatomy diagram — see the rendered docs page._",
  );
  body = body.replace(
    /<Accessibility[^>]*\/>/g,
    "_Accessibility section — see the rendered docs page._",
  );
  body = body.replace(
    /<Accessibility[^>]*>([\s\S]*?)<\/Accessibility>/g,
    "_Accessibility section — see the rendered docs page._",
  );
  body = body.replace(
    /<IconGrid[^>]*\/>/g,
    "_Icon grid — see the rendered docs page._",
  );
  body = body.replace(
    /<FileTree[^>]*\/>/g,
    "_File tree — see the rendered docs page._",
  );
  body = body.replace(
    /<FileTree[^>]*>([\s\S]*?)<\/FileTree>/g,
    "_File tree — see the rendered docs page._",
  );
  body = body.replace(/<Card\s+([^>]*)\/>/g, (_m, attrs) => {
    const title = attrs.match(/title="([^"]+)"/)?.[1] ?? "Untitled";
    const href = attrs.match(/href="([^"]+)"/)?.[1] ?? "#";
    const description = attrs.match(/description="([^"]+)"/)?.[1];
    return `- [${title}](${href})${description ? ` — ${description}` : ""}`;
  });
  body = body.replace(
    /<Card([^>]*)>([\s\S]*?)<\/Card>/g,
    (_m, attrs, inner) => {
      const title = attrs.match(/title="([^"]+)"/)?.[1] ?? "Untitled";
      const href = attrs.match(/href="([^"]+)"/)?.[1] ?? "#";
      const cleaned = String(inner).trim();
      return `- [${title}](${href})${cleaned ? ` — ${cleaned}` : ""}`;
    },
  );
  body = stripWrapper(body, "CardGrid");
  body = body.replace(/<Tabs[^>]*>/g, "");
  body = body.replace(/<\/Tabs>/g, "");
  body = body.replace(/<Tab[^>]*>/g, "\n");
  body = body.replace(/<\/Tab>/g, "");

  const header = [
    `# ${frontmatter.title}`,
    frontmatter.description ? `\n${frontmatter.description}` : "",
    frontmatter.status ? `\nStatus: **${frontmatter.status}**` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${header}\n\n${body.trim()}\n`;
}

async function collectDocs(section, dir, slugPrefix, results) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;
    if (entry.isDirectory()) {
      await collectDocs(
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
      source: content,
      frontmatter: data,
    });
  }
}

async function listAllDocs() {
  const results = [];
  const sections = await readdir(CONTENT_DIR, { withFileTypes: true });
  for (const section of sections) {
    if (!section.isDirectory()) continue;
    await collectDocs(
      section.name,
      path.join(CONTENT_DIR, section.name),
      [],
      results,
    );
  }
  return results;
}

async function loadNavForLlms() {
  const rootMeta = JSON.parse(
    await readFile(path.join(CONTENT_DIR, "_meta.json"), "utf-8"),
  );
  return rootMeta.tabs;
}

async function main() {
  const docs = await listAllDocs();
  const topTabs = await loadNavForLlms();
  let mdCount = 0;

  for (const doc of docs) {
    const md = mdxToMarkdown(doc.source, doc.frontmatter);
    const mdPath = path.join(OUTPUT_DIR, doc.href + ".md");
    await mkdir(path.dirname(mdPath), { recursive: true });
    await writeFile(mdPath, md);
    mdCount++;
  }

  // llms.txt
  const llmsLines = [
    "# Kaizen Design System",
    "",
    "> Living documentation for the Kaizen design system: foundations, components, and patterns powering bsport's modern back-office surfaces. Append `.md` to any docs URL to get a plain-markdown rendering.",
    "",
  ];
  const docsBySection = new Map();
  for (const doc of docs) {
    const section = doc.slug[0];
    const list = docsBySection.get(section) ?? [];
    list.push(doc);
    docsBySection.set(section, list);
  }
  for (const tab of topTabs) {
    const sectionDocs = docsBySection.get(tab.key) ?? [];
    if (sectionDocs.length === 0) continue;
    llmsLines.push(`## ${tab.label}`, "");
    const landing = sectionDocs.find(
      (doc) => doc.slug.length === 1 && doc.slug[0] === tab.key,
    );
    if (landing) {
      llmsLines.push(
        `- [${landing.frontmatter.title}](${DOCS_URL}${landing.href}.md)${
          landing.frontmatter.description
            ? `: ${landing.frontmatter.description}`
            : ""
        }`,
      );
    }
    for (const doc of sectionDocs) {
      if (doc === landing) continue;
      llmsLines.push(
        `- [${doc.frontmatter.title}](${DOCS_URL}${doc.href}.md)${
          doc.frontmatter.description ? `: ${doc.frontmatter.description}` : ""
        }`,
      );
    }
    llmsLines.push("");
  }
  await writeFile(path.join(OUTPUT_DIR, "llms.txt"), llmsLines.join("\n"));

  // llms-full.txt
  const tabOrder = new Map(topTabs.map((tab, i) => [tab.key, i]));
  docs.sort((a, b) => {
    const ai = tabOrder.get(a.slug[0]) ?? Number.MAX_SAFE_INTEGER;
    const bi = tabOrder.get(b.slug[0]) ?? Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    if (a.slug.length !== b.slug.length) return a.slug.length - b.slug.length;
    return a.href.localeCompare(b.href);
  });
  const fullBody = docs
    .map((doc) => mdxToMarkdown(doc.source, doc.frontmatter).trim())
    .join("\n\n---\n\n");
  await writeFile(path.join(OUTPUT_DIR, "llms-full.txt"), fullBody + "\n");

  console.log(
    `[generate-static-exports] wrote ${mdCount} .md files + llms.txt + llms-full.txt`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
