import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { Command } from "commander";
import fs from "fs";
import { globSync } from "glob";
import path from "path";

import {
  getMonorepoBasePathSync,
  getProjectPath,
} from "@bsport/typescript-monorepo-utils";

import {
  type ProjectConfig,
  ensureDir,
  getFlattenKeyValuePairs,
  getProjectConfig,
  getSourceTranslations,
  selectProject,
} from "./utils";

const TRANSLATION_FUNCS = [
  "t",
  "i18n.t",
  "i18nKey", // Trans component
  "snackbarSuccess",
  "snackbarError",
  "this.props.t",
  "props.t",
];
const SOURCE_GLOB = "src/**/*.{js,jsx,ts,tsx}";

const SAAS_LEGACY_NAME = "@bsport/saas-legacy";
const WIDGET_LEGACY_NAME = "@bsport/widget-legacy";
const COMMON_LEGACY_NAME = "@bsport/common";

const WHITELIST_SAAS_LEGACY = [
  "rolePermissions", // JSON comes from backend data
  "objectLevelPermissions", // JSON comes from backend data
  "mobilePersonalization", // Shitty declaration
  "presetValuesByDatatype", // Keys are declared outside t function
  "presetValuesByIdentifier", // Keys are declared outside t function
  "tab.", // Keys are declared outside t function for any tabs
  "graphDefaultTitles",
];

const program = new Command();

program
  .name("i18n:project:find-unused-keys")
  .description(
    "Find unused keys in a internationalized project." +
      "\nPitfall: there could be identical keys in different resources, where some can be used an others not.",
  )
  .option(
    "-p, --project <string>",
    "Project to analyze. If not provided, you'll be able to choose it in the list.",
  )
  .action(main)
  .parse(process.argv);

async function main({ project }: { project?: string }) {
  const ichizenBasePath = getMonorepoBasePathSync();
  const legacyCommonPath = path.join(
    ichizenBasePath,
    getProjectPath({ projectName: COMMON_LEGACY_NAME }),
  );

  // Step 1 - Retrieve the config of the project to analyze
  const selectedProject: ProjectConfig = await selectProject({
    initialProject: project,
  });

  // Step 2 - Retrieve all translations keys of the project
  const sourceTranslations = getSourceTranslations(selectedProject);

  // Step 3 - Flatten and extract keys, then remove namespace
  const flattenKeyValuePairs = getFlattenKeyValuePairs(sourceTranslations);
  const flattenKeys = flattenKeyValuePairs.map((pair) => {
    return pair.flattenKey;
  });

  // Step 4 - Parse project files to collect used keys
  let usedKeys: Set<string>;
  if (selectedProject.name === SAAS_LEGACY_NAME) {
    // Keys are used in `@bsport/saas-legacy`, `@bsport/widget-legacy` and `@bsport/common` !
    const saasGlobPattern = path.join(
      selectedProject.pathToProject,
      SOURCE_GLOB,
    );
    usedKeys = findUsedKeys({
      globPattern: saasGlobPattern,
      isLegacy: true,
    });

    const widgetConfig = await getProjectConfig(WIDGET_LEGACY_NAME);
    if (widgetConfig) {
      const widgetGlobPattern = path.join(
        widgetConfig.pathToProject,
        SOURCE_GLOB,
      );
      const widgetUsedKeys = findUsedKeys({
        globPattern: widgetGlobPattern,
        isLegacy: true,
      });
      usedKeys = usedKeys.union(widgetUsedKeys);
    }

    const commonGlobPattern = path.join(legacyCommonPath, SOURCE_GLOB);
    const commonUsedKeys = findUsedKeys({
      globPattern: commonGlobPattern,
      isLegacy: true,
    });
    usedKeys = usedKeys.union(commonUsedKeys);
  } else {
    const globPattern = path.join(selectedProject.pathToProject, SOURCE_GLOB);
    usedKeys = findUsedKeys({ globPattern, isLegacy: false });
  }

  // Step 5 - Separate exact keys and wildcard keys because of dynamic key generation in the code
  // This handles case like "reasons.map(r => t(`reasons.${r}`))"
  const exactUsed = Array.from(usedKeys)
    .filter((k) => !k.endsWith("*"))
    .map((k) => (k.includes(":") ? k.slice(k.indexOf(":") + 1) : k));
  let wildcardUsed = Array.from(usedKeys)
    .filter((k) => k.endsWith("*"))
    .map((k) => {
      // return k.slice(0, -1);
      const kNoStar = k.slice(0, -1); // remove the *
      return kNoStar.includes(":")
        ? kNoStar.slice(kNoStar.indexOf(":") + 1)
        : kNoStar;
    })
    .filter(Boolean);

  if (selectedProject.name === SAAS_LEGACY_NAME) {
    // Append whitelist prefix
    wildcardUsed = wildcardUsed.concat(WHITELIST_SAAS_LEGACY);
  }

  // Step 6 - Load all text patterns

  // Load all non-JSON source files
  const searchGlobPatterns: string[] = [];
  if (selectedProject.name === SAAS_LEGACY_NAME) {
    const saasGlobPattern = path.join(
      selectedProject.pathToProject,
      SOURCE_GLOB,
    );
    searchGlobPatterns.push(saasGlobPattern);

    const widgetConfig = await getProjectConfig(WIDGET_LEGACY_NAME);
    if (widgetConfig) {
      const widgetGlobPattern = path.join(
        widgetConfig.pathToProject,
        SOURCE_GLOB,
      );
      searchGlobPatterns.push(widgetGlobPattern);
    }

    const commonGlobPattern = path.join(legacyCommonPath, SOURCE_GLOB);
    searchGlobPatterns.push(commonGlobPattern);
  } else {
    const globPattern = path.join(selectedProject.pathToProject, SOURCE_GLOB);
    searchGlobPatterns.push(globPattern);
  }

  const allSourceFiles = searchGlobPatterns.flatMap((pattern) =>
    globSync(pattern, { absolute: true }),
  );

  const allSourceText = allSourceFiles
    .map((f) => fs.readFileSync(f, "utf-8"))
    .join("\n");

  // Step 7 - Infer unused key

  const unusedKeys = flattenKeys
    .filter((flattenKey) => {
      // 0. Remove namespace
      const [_namespace, ...parts] = flattenKey.split(".");
      const k = parts.join(".");

      // 1. Exact match
      if (exactUsed.includes(k)) {
        return false;
      }

      // 2. Plural case, if it ends with _plural we check if the singular form is used
      if (
        k.endsWith("_plural") &&
        exactUsed.includes(k.slice(0, k.length - "_plural".length))
      ) {
        return false;
      }

      // 3. Wildcard match: does key start with any wildcard prefix?
      if (wildcardUsed.some((prefix) => k.startsWith(prefix))) {
        return false;
      }

      // 4. Global text search fallback - e.g. if a git grep retrieves the key, then tag it as used
      if (allSourceText.includes(k)) {
        return false;
      }

      // Otherwise, it's unused
      return true;
    })
    .sort((a, b) => a.localeCompare(b));

  const unusedKeyValuePairs = flattenKeyValuePairs.filter((pair) => {
    return unusedKeys.includes(pair.flattenKey);
  });
  const unusedSourceWords = unusedKeyValuePairs.reduce((acc, pair) => {
    return acc + pair.value.split(" ").length;
  }, 0);

  // Step 7 - Generate report
  console.log("🔍 Total keys:", flattenKeys.length);
  console.log(
    `✅ Used keys: ${usedKeys.size} (including ${wildcardUsed.length} wildcard keys)`,
  );
  console.log(`🗑️  Unused keys: ${unusedKeys.length}`);
  console.log(`🚀 Potential source words savings: ${unusedSourceWords}`);

  const destDir = path.join(__dirname, "../__tmp__");
  ensureDir(destDir);

  const unusedKeysReport = "unused-keys.json";
  const transformNamespace = (flattenKey: string) => {
    const [namespace, ...other] = flattenKey.split(".");
    return `${namespace}:${other.join(".")}`;
  };
  fs.writeFileSync(
    path.join(destDir, unusedKeysReport),
    JSON.stringify(unusedKeys.map(transformNamespace), null, 2),
  );

  const flattenKeysReport = "flatten-keys.json";
  fs.writeFileSync(
    path.join(destDir, flattenKeysReport),
    JSON.stringify(flattenKeys, null, 2),
  );

  const usedKeysReport = "used-keys.json";
  fs.writeFileSync(
    path.join(destDir, usedKeysReport),
    JSON.stringify(Array.from(usedKeys), null, 2),
  );

  const wildcardKeysReport = "wildcard-keys.json";
  fs.writeFileSync(
    path.join(destDir, wildcardKeysReport),
    JSON.stringify(wildcardUsed, null, 2),
  );

  console.group(
    `📄 Reports written to ${path.relative(ichizenBasePath, destDir)}`,
  );
  console.log(`- ${flattenKeysReport}: List of all flatten keys`);
  console.log(
    `- ${unusedKeysReport}: List of unused keys prefixed by their namespaces`,
  );
  console.log(`- ${usedKeysReport}: List of used keys`);
  console.log(
    `- ${wildcardKeysReport}: List of used wildcard keys, e.g. partial keys that encompass all their children keys`,
  );
  console.groupEnd();

  if (unusedKeys.length === 0) {
    console.log("🎉 No unused keys found!");
  }
}

/**
 * Parse files matching the globPattern with Abstract Syntax Tree (AST) to retrieve call to a i18n key
 * @param globPattern Filepath pattern to get files to analyze
 * @returns A set with the used keys
 */
function findUsedKeys({
  globPattern,
  isLegacy,
}: {
  globPattern: string;
  isLegacy: boolean;
}): Set<string> {
  const ichizenBasePath = getMonorepoBasePathSync();

  const files = globSync(globPattern, { absolute: true });
  const used = new Set<string>();
  let counter = 0;
  for (const file of files) {
    const code = fs.readFileSync(file, "utf-8");
    let ast;
    try {
      ast = parse(code, {
        sourceType: "module",
        plugins: isLegacy // Need to give some loose for legacy
          ? [
              "jsx",
              file.endsWith(".js") || file.endsWith(".jsx")
                ? "flow"
                : "typescript",
              "classProperties",
              "classPrivateProperties",
              "classPrivateMethods",
              "decorators-legacy",
              "dynamicImport",
              "optionalChaining",
              "nullishCoalescingOperator",
              "objectRestSpread",
              "topLevelAwait",
              "importMeta",
              "exportDefaultFrom",
              "exportNamespaceFrom",
              "flowComments",
            ]
          : ["typescript", "jsx"],
      });
    } catch (e) {
      counter += 1;
      console.warn(
        `Failed to parse ${path.relative(ichizenBasePath, file)}:`,
        e,
      );
      continue;
    }

    traverse(ast, {
      CallExpression(path) {
        const callee = path.get("callee");
        let fnName = "";

        // Case A: simple identifier (t)
        if (callee.isIdentifier()) {
          fnName = callee.node.name;
        }

        // Case B: member expression (i18n.t, this.props.t, somethingElse.t)
        else if (callee.isMemberExpression()) {
          // Walk down the chain until we find the property
          let current: any = callee;
          while (current.isMemberExpression()) {
            const prop = current.get("property");
            if (prop.isIdentifier() && prop.node.name === "t") {
              fnName = "t"; // normalize any *.t into just "t"
              break;
            }
            current = current.get("object");
          }
        }

        if (!TRANSLATION_FUNCS.includes(fnName)) return;

        const arg = path.node.arguments[0];
        if (!arg) return;

        // --- Case 1: direct string ---
        if (arg.type === "StringLiteral") {
          used.add(arg.value);
        }

        // --- Case 2: ternary ---
        else if (arg.type === "ConditionalExpression") {
          if (arg.consequent.type === "StringLiteral") {
            used.add(arg.consequent.value);
          }
          if (arg.alternate.type === "StringLiteral") {
            used.add(arg.alternate.value);
          }
        }

        // --- Case 3: template literal ---
        else if (arg.type === "TemplateLiteral") {
          const quasis = arg.quasis.map((q) => q.value.cooked || "");

          if (arg.expressions.length === 0) {
            // Fully static template → same as string
            used.add(quasis.join(""));
          } else {
            // Dynamic: capture static prefix up to first ${}
            const prefix = quasis[0];
            if (prefix) {
              used.add(prefix + "*");
            }
          }
        }
      },

      JSXOpeningElement(path) {
        const name = path.node.name;
        if (name.type === "JSXIdentifier" && name.name === "Trans") {
          const i18nKeyAttr = path.node.attributes.find(
            (attr) =>
              attr.type === "JSXAttribute" && attr.name.name === "i18nKey",
          );
          if (
            i18nKeyAttr &&
            // @ts-expect-error
            i18nKeyAttr.value &&
            // @ts-expect-error
            i18nKeyAttr.value.type === "StringLiteral"
          ) {
            // @ts-expect-error
            used.add(i18nKeyAttr.value.value);
          }
        }
      },
    });
  }
  if (counter > 0) {
    console.log(`⚠️  Failed to parse ${counter} files.`);
  }
  return used;
}
