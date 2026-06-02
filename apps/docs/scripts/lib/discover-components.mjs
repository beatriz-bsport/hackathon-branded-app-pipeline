import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(HERE, "../..");
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
const COMPONENTS_DIR = path.join(KAIZEN_PRIMITIVE_ROOT, "src", "components");
const INDEX_PATH = path.join(KAIZEN_PRIMITIVE_ROOT, "src", "index.ts");

/** Components without `default as` in index.ts but with a parseable source file. */
const MANUAL_TARGETS = [
  { name: "Toast", folder: "Toast", file: "Toast.tsx" },
  {
    name: "HeaderLayout",
    folder: "private/HeaderLayout",
    file: "HeaderLayout.tsx",
  },
  { name: "EmptyState", folder: "private/EmptyState", file: "EmptyState.tsx" },
  { name: "Dialog", folder: "private/Dialog", file: "Dialog.tsx" },
  { name: "Pagination", folder: "private/Pagination", file: "Pagination.tsx" },
  {
    name: "LayoutButton",
    folder: "private/LayoutButton",
    file: "LayoutButton.tsx",
  },
];

const SKIP_FOLDERS = new Set([
  "I18nProvider",
  "ThemeProvider",
  "label",
  "organisms",
  "private",
  "FileUploadLoading",
  "FileUploadInput",
  "withLink",
]);

function parseDefaultExports(source) {
  const names = new Set();
  const re = /export\s*\{\s*default\s+as\s+(\w+)/g;
  let match;
  while ((match = re.exec(source)) !== null) {
    names.add(match[1]);
  }
  return names;
}

function resolveComponentFile(folderName) {
  const candidates = [
    path.join(COMPONENTS_DIR, folderName, `${folderName}.tsx`),
    path.join(COMPONENTS_DIR, folderName, "index.tsx"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

function folderForExport(name) {
  if (name === "RadioGroup") return "RadioGroup";
  return name;
}

/**
 * @returns {Array<{ name: string, file: string | null, importPath: string }>}
 */
export async function discoverComponentTargets() {
  const indexSource = await readFile(INDEX_PATH, "utf-8");
  const exported = parseDefaultExports(indexSource);
  const targets = new Map();

  for (const name of exported) {
    const folder = folderForExport(name);
    targets.set(name, {
      name,
      file: resolveComponentFile(folder),
      importPath: `@bsport/kaizen-primitive-core/${name}`,
    });
  }

  for (const manual of MANUAL_TARGETS) {
    if (targets.has(manual.name)) continue;
    const file = path.join(COMPONENTS_DIR, manual.folder, manual.file);
    targets.set(manual.name, {
      name: manual.name,
      file: existsSync(file) ? file : null,
      importPath: `@bsport/kaizen-primitive-core/${manual.name}`,
    });
  }

  const folders = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  for (const entry of folders) {
    if (!entry.isDirectory() || SKIP_FOLDERS.has(entry.name)) continue;
    const name = entry.name;
    if (targets.has(name)) continue;
    targets.set(name, {
      name,
      file: resolveComponentFile(name),
      importPath: `@bsport/kaizen-primitive-core/${name}`,
    });
  }

  const privateDir = path.join(COMPONENTS_DIR, "private");
  if (existsSync(privateDir)) {
    const privateEntries = await readdir(privateDir, { withFileTypes: true });
    for (const entry of privateEntries) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      if (targets.has(name)) continue;
      const file = path.join(privateDir, name, `${name}.tsx`);
      targets.set(name, {
        name,
        file: existsSync(file) ? file : null,
        importPath: `@bsport/kaizen-primitive-core/${name}`,
      });
    }
  }

  return [...targets.values()].sort((a, b) => a.name.localeCompare(b.name));
}
