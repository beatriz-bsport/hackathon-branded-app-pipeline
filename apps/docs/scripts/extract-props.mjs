import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { discoverComponentTargets } from "./lib/discover-components.mjs";

const require = createRequire(import.meta.url);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(HERE, "..");

function loadDocgen() {
  const { readdirSync, existsSync } = require("node:fs");
  const pnpmDirs = [
    path.join(DOCS_ROOT, "node_modules", ".pnpm"),
    path.join(DOCS_ROOT, "..", "..", "node_modules", ".pnpm"),
  ];
  const pnpmDir = pnpmDirs.find((dir) => existsSync(dir));
  if (!pnpmDir) {
    return require("react-docgen-typescript");
  }

  const match = readdirSync(pnpmDir).find((entry) =>
    entry.startsWith("react-docgen-typescript@2."),
  );
  if (!match) {
    return require("react-docgen-typescript");
  }

  return require(
    path.join(pnpmDir, match, "node_modules", "react-docgen-typescript"),
  );
}

const docgen = loadDocgen();

const KAIZEN_PRIMITIVE_ROOT = path.join(
  DOCS_ROOT,
  "..",
  "..",
  "packages",
  "design-system",
  "kaizen",
  "primitive",
  "core",
);

const TSCONFIG = path.join(KAIZEN_PRIMITIVE_ROOT, "tsconfig.dts.json");
const OUT_DIR = path.join(DOCS_ROOT, "lib", "generated");
const OUT_PATH = path.join(OUT_DIR, "props.json");

function normaliseType(rawType) {
  if (!rawType) return "unknown";
  const value =
    rawType.name === "enum" ? (rawType.raw ?? rawType.name) : rawType.name;
  return (
    String(value)
      .replace(/\|\s*undefined/g, "")
      .replace(/\s+/g, " ")
      .trim() || "unknown"
  );
}

function normaliseProp(name, prop) {
  return {
    name,
    type: normaliseType(prop.type),
    required: Boolean(prop.required),
    defaultValue:
      prop.defaultValue && prop.defaultValue.value !== undefined
        ? String(prop.defaultValue.value)
        : undefined,
    description: prop.description?.trim() || undefined,
  };
}

function isExternal(filename) {
  if (!filename) return true;
  return (
    filename.includes("node_modules") ||
    filename.endsWith(".d.ts") ||
    !filename.includes("/packages/design-system/kaizen/")
  );
}

function extractJsDocPropDescriptions(source) {
  const descriptions = new Map();
  const re = /@param\s+props\.(\w+)\s+([\s\S]*?)(?=\n \* @|\n \*\/)/g;
  let match;
  while ((match = re.exec(source)) !== null) {
    descriptions.set(
      match[1],
      match[2]
        .replace(/\n \* ?/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    );
  }
  return descriptions;
}

function extractTypeFields(source, componentName) {
  const typeNames = [
    "Props",
    `${componentName}Props`,
    `${componentName}ManagedProps`,
  ];
  const fields = new Map();

  for (const typeName of typeNames) {
    const typeRe = new RegExp(
      `export\\s+type\\s+${typeName}\\s*=\\s*([\\s\\S]*?);`,
    );
    const match = typeRe.exec(source);
    if (!match) continue;

    const body = match[1];
    const objectBlocks = body.matchAll(/\{([\s\S]*?)\}/g);
    for (const block of objectBlocks) {
      const fieldRe = /^\s*(\w+)(\?)?:\s*([^;,\n]+)/gm;
      let fieldMatch;
      while ((fieldMatch = fieldRe.exec(block[1])) !== null) {
        fields.set(fieldMatch[1], {
          type: fieldMatch[3].trim(),
          required: fieldMatch[2] !== "?",
        });
      }
    }
  }

  return fields;
}

function extractDefaultValues(source, componentName) {
  const defaults = new Map();
  const re = new RegExp(
    `(?:const\\s+${componentName}|function\\s+${componentName})[\\s\\S]*?=\\s*\\(\\{([\\s\\S]*?)\\}\\)\\s*=>`,
  );
  const fnRe = new RegExp(
    `function\\s+${componentName}\\s*\\(\\{([\\s\\S]*?)\\}\\)`,
  );
  const block = re.exec(source)?.[1] ?? fnRe.exec(source)?.[1];
  if (!block) return defaults;

  for (const part of block.split(",")) {
    const trimmed = part.trim();
    const match = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (match) {
      defaults.set(match[1], match[2].trim());
    }
  }

  return defaults;
}

function extractPropsFallback(source, componentName) {
  const descriptions = extractJsDocPropDescriptions(source);
  const fields = extractTypeFields(source, componentName);
  const defaults = extractDefaultValues(source, componentName);
  const props = [];

  for (const [name, field] of fields) {
    if (name === "className" && !descriptions.has(name)) continue;
    props.push({
      name,
      type: field.type,
      required: field.required && !defaults.has(name),
      defaultValue: defaults.get(name),
      description: descriptions.get(name),
    });
  }

  if (props.length === 0 && descriptions.size > 0) {
    for (const [name, description] of descriptions) {
      props.push({
        name,
        type: "unknown",
        required: false,
        description,
      });
    }
  }

  return props.sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

async function main() {
  const parser = docgen.withCustomConfig(TSCONFIG, {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => {
      if (prop.declarations && prop.declarations.length > 0) {
        const fromExternal = prop.declarations.every((d) =>
          isExternal(d.fileName),
        );
        if (fromExternal) return false;
      } else if (prop.parent && isExternal(prop.parent.fileName)) {
        return false;
      }
      return true;
    },
  });

  const output = {};
  const targets = await discoverComponentTargets();
  let extracted = 0;
  let skipped = 0;

  for (const target of targets) {
    if (!target.file) {
      console.warn(
        `[extract-props] No source file for ${target.name} (${target.importPath}); skipping.`,
      );
      skipped += 1;
      continue;
    }

    let docs;
    try {
      docs = parser.parse(target.file);
    } catch (error) {
      console.warn(
        `[extract-props] Failed to parse ${target.name} (${path.relative(DOCS_ROOT, target.file)}): ${error.message}`,
      );
      skipped += 1;
      continue;
    }

    if (docs.length === 0) {
      const source = await readFile(target.file, "utf-8");
      const fallbackProps = extractPropsFallback(source, target.name);
      if (fallbackProps.length === 0) {
        console.warn(
          `[extract-props] No component found in ${target.file}; skipping ${target.name}.`,
        );
        skipped += 1;
        continue;
      }

      output[target.name] = fallbackProps;
      extracted += 1;
      console.log(
        `[extract-props] ${target.name.padEnd(24)} ${fallbackProps.length} prop${fallbackProps.length === 1 ? "" : "s"} (fallback)`,
      );
      continue;
    }

    const doc = docs[0];
    const props = Object.entries(doc.props ?? {})
      .map(([name, prop]) => normaliseProp(name, prop))
      .sort((a, b) => {
        if (a.required !== b.required) return a.required ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

    output[target.name] = props;
    extracted += 1;
    console.log(
      `[extract-props] ${target.name.padEnd(24)} ${props.length} prop${props.length === 1 ? "" : "s"}`,
    );
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log(
    `[extract-props] wrote ${path.relative(DOCS_ROOT, OUT_PATH)} (${extracted} components, ${skipped} skipped)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
