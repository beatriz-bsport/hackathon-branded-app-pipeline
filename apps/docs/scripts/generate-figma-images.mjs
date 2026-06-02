import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(HERE, "..");
const CONTENT_DIR = path.join(DOCS_ROOT, "content");
const GENERATED_DIR = path.join(DOCS_ROOT, "lib", "generated");
const FIGMA_OUT = path.join(GENERATED_DIR, "figma-images.json");

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN?.trim();

function parseFigmaFrameUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("figma.com")) return null;
    const nodeIdParam = parsed.searchParams.get("node-id");
    if (!nodeIdParam) return null;
    const nodeId = nodeIdParam.replace(/-/g, ":");
    const segments = parsed.pathname.split("/").filter(Boolean);
    const designIndex = segments.indexOf("design");
    if (designIndex === -1) return null;
    const branchIndex = segments.indexOf("branch");
    const fileKey =
      branchIndex !== -1 && segments[branchIndex + 1]
        ? segments[branchIndex + 1]
        : segments[designIndex + 1];
    if (!fileKey) return null;
    return { fileKey, nodeId };
  } catch {
    return null;
  }
}

async function fetchFigmaFrameImageUrl(figmaUrl) {
  if (!FIGMA_TOKEN) return null;
  const frame = parseFigmaFrameUrl(figmaUrl);
  if (!frame) return null;
  const params = new URLSearchParams({
    ids: frame.nodeId,
    format: "png",
    scale: "2",
  });
  try {
    const response = await fetch(
      `https://api.figma.com/v1/images/${frame.fileKey}?${params.toString()}`,
      { headers: { "X-Figma-Token": FIGMA_TOKEN } },
    );
    if (!response.ok) return null;
    const payload = await response.json();
    if (payload.err) return null;
    return payload.images?.[frame.nodeId] ?? null;
  } catch {
    return null;
  }
}

async function scanMdxForFigmaUrls(dir, urls) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;
    if (entry.isDirectory()) {
      await scanMdxForFigmaUrls(path.join(dir, entry.name), urls);
      continue;
    }
    if (!entry.name.endsWith(".mdx")) continue;
    const raw = await readFile(path.join(dir, entry.name), "utf-8");
    const re = /<(?:Do|Dont)\s+[^>]*figma="([^"]+)"[^>]*\/?>/g;
    let match;
    while ((match = re.exec(raw)) !== null) {
      urls.add(match[1]);
    }
  }
}

async function main() {
  const urls = new Set();
  await scanMdxForFigmaUrls(CONTENT_DIR, urls);

  const mapping = {};

  if (urls.size > 0 && FIGMA_TOKEN) {
    console.log(
      `[generate-figma-images] resolving ${urls.size} Figma frame(s)…`,
    );
    for (const url of urls) {
      const imageUrl = await fetchFigmaFrameImageUrl(url);
      if (imageUrl) mapping[url] = imageUrl;
    }
    console.log(
      `[generate-figma-images] resolved ${Object.keys(mapping).length}/${urls.size}`,
    );
  } else if (urls.size > 0) {
    console.log(
      `[generate-figma-images] skipping ${urls.size} frames (no FIGMA_ACCESS_TOKEN)`,
    );
  }

  await mkdir(GENERATED_DIR, { recursive: true });
  await writeFile(FIGMA_OUT, JSON.stringify(mapping, null, 2));
  console.log(
    `[generate-figma-images] wrote ${path.relative(DOCS_ROOT, FIGMA_OUT)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
