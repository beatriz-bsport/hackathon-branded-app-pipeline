import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { inferColorTokenDescription } from "./lib/infer-color-token-description.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(DOCS_ROOT, "..", "..");

const TOKENS_ROOT = path.join(
  REPO_ROOT,
  "packages",
  "design-system",
  "kaizen",
  "tokens",
  "src",
);

const CSS_PATH = path.join(TOKENS_ROOT, "index.css");
const THEME_PATH = path.join(TOKENS_ROOT, "tailwind.theme.json");

const OUT_DIR = path.join(DOCS_ROOT, "lib", "generated");
const OUT_PATH = path.join(OUT_DIR, "tokens.json");

const TOP_LEVEL_TYPE = {
  colors: "color",
  borderRadius: "border-radius",
  borderWidth: "border-width",
  spacing: "spacing",
  fontFamily: "font-family",
  fontWeight: "font-weight",
  fontSize: "font-size",
  lineHeight: "line-height",
  letterSpacing: "letter-spacing",
  opacity: "opacity",
  boxShadow: "box-shadow",
  transitionDuration: "transition-duration",
  transitionTimingFunction: "transition-timing-function",
  zIndex: "z-index",
  width: "width",
  height: "height",
};

const ROOT_PREFIX = {
  colors: "color",
  borderRadius: "border.radius",
  borderWidth: "border.width",
  spacing: "spacing",
  fontFamily: "font.family",
  fontWeight: "font.weight",
  fontSize: "font.size",
  lineHeight: "line-height",
  letterSpacing: "letter-spacing",
  opacity: "opacity",
  boxShadow: "shadow",
  transitionDuration: "motion.duration",
  transitionTimingFunction: "motion.easing",
  zIndex: "z",
  width: "width",
  height: "height",
};

function parseCssVariables(cssSource) {
  const map = new Map();
  const rootMatch = cssSource.match(/:root\s*\{([\s\S]*?)\n\}/);
  const scope = rootMatch?.[1] ?? cssSource;
  const re = /--([a-z0-9-]+):\s*([^;]+);/gi;
  let match;
  while ((match = re.exec(scope)) !== null) {
    map.set(match[1].trim(), match[2].trim());
  }
  return map;
}

function extractCssVar(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/var\(\s*--([a-z0-9-]+)\s*\)/i);
  return match ? match[1] : null;
}

function walk(node, currentPath, prefixType, cssVars, out) {
  if (node == null) return;
  if (typeof node === "string" || typeof node === "number") {
    const stringValue = String(node);
    const cssVar = extractCssVar(stringValue);
    const cssVariable = cssVar ? `--${cssVar}` : undefined;
    const resolvedValue = cssVar
      ? (cssVars.get(cssVar) ?? stringValue)
      : stringValue;
    out.push({
      name: currentPath[currentPath.length - 1] ?? "",
      path: currentPath.join("."),
      value: resolvedValue,
      type: prefixType,
      cssVariable,
      alias: cssVariable,
      description: undefined,
    });
    return;
  }
  if (typeof node !== "object") return;
  for (const [key, child] of Object.entries(node)) {
    walk(child, [...currentPath, key], prefixType, cssVars, out);
  }
}

async function main() {
  const [cssSource, themeJson] = await Promise.all([
    readFile(CSS_PATH, "utf-8"),
    readFile(THEME_PATH, "utf-8"),
  ]);
  const cssVars = parseCssVariables(cssSource);
  const theme = JSON.parse(themeJson);

  const tokens = [];
  for (const [topKey, value] of Object.entries(theme)) {
    const prefix = ROOT_PREFIX[topKey] ?? topKey;
    const type = TOP_LEVEL_TYPE[topKey] ?? topKey;
    walk(value, [prefix], type, cssVars, tokens);
  }

  for (const token of tokens) {
    if (token.type !== "color") continue;
    token.description = inferColorTokenDescription(token.path);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify({ tokens }, null, 2) + "\n");
  console.log(
    `[extract-tokens] wrote ${tokens.length} tokens to ${path.relative(DOCS_ROOT, OUT_PATH)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
