import { Tree, formatFiles, logger, visitNotIgnoredFiles } from "@nx/devkit";

import {
  listResources,
  resolveApiPackage,
  resourceSourceFiles,
} from "../align-api-shared/api-package";
import {
  RelocatableOption,
  ensureNamedImportWith,
  findRelocatableOptions,
  relocateAtCallSites,
  removeNamedImportIfUnused,
  stripBuilderOptions,
} from "../align-api-shared/builder-relocate";
import { collectResourceExports } from "../align-api-shared/exports";

type VanillaizeBuildersSchema = {
  appName: string;
  resource: string;
};

const SEARCH_ROOTS = ["apps", "packages"];
const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
const HAS_IDENTIFIER = /[A-Za-z_$]/;

function candidateFiles(tree: Tree, anchors: string[]): string[] {
  const files: string[] = [];
  for (const searchRoot of SEARCH_ROOTS) {
    if (!tree.exists(searchRoot)) continue;
    visitNotIgnoredFiles(tree, searchRoot, (filePath) => {
      if (!/\.tsx?$/.test(filePath)) return;
      const content = tree.read(filePath, "utf-8");
      if (content && anchors.some((a) => content.includes(`${a}(`))) {
        files.push(filePath);
      }
    });
  }
  return files;
}

/**
 * Rule 1: move app-preference options out of a resource's option builders and
 * re-apply them, verbatim, at every consumer call site. Strictly all-or-nothing
 * — if any call site cannot be safely rewritten, nothing is changed and the
 * sites are reported, so behavior is never silently regressed.
 */
export async function vanillaizeBuildersGenerator(
  tree: Tree,
  schema: VanillaizeBuildersSchema,
): Promise<void> {
  const { packageName, root } = resolveApiPackage(tree, schema.appName);
  const resources = listResources(tree, root);
  if (!resources.includes(schema.resource)) {
    throw new Error(
      `Resource "${schema.resource}" not found in ${packageName}. Available: ${resources.join(", ")}`,
    );
  }

  // 1. Find relocatable options, tagged with their builder + source file.
  const builderFiles = resourceSourceFiles(tree, root, schema.resource);
  const optionsByFile = new Map<string, RelocatableOption[]>();
  const allOptions: RelocatableOption[] = [];
  for (const filePath of builderFiles) {
    const content = tree.read(filePath, "utf-8");
    if (content === null) continue;
    const found = findRelocatableOptions(content);
    if (found.length > 0) {
      optionsByFile.set(filePath, found);
      allOptions.push(...found);
    }
  }

  if (allOptions.length === 0) {
    logger.info(
      `${packageName}/${schema.resource} builders are already vanilla.`,
    );
    return;
  }

  // 2. Decide how each relocated value reaches the call site.
  const resourceExports = collectResourceExports(tree, root, schema.resource);
  const importSymbols = new Set<string>();
  const blockers: string[] = [];
  for (const opt of allOptions) {
    const value = opt.valueText.trim();
    if (IDENTIFIER.test(value)) {
      if (!resourceExports.has(value)) {
        blockers.push(
          `${opt.builderName}.${opt.option} uses "${value}", which the resource does not export — cannot import it at call sites.`,
        );
      } else {
        importSymbols.add(value);
      }
    } else if (HAS_IDENTIFIER.test(value)) {
      blockers.push(
        `${opt.builderName}.${opt.option} has a non-trivial value "${value}" — relocate by hand.`,
      );
    }
    // pure literals inline with no import
  }

  // 3. Classify every call site BEFORE touching anything (all-or-nothing).
  const builders = new Map<string, { option: string; valueText: string }[]>();
  for (const opt of allOptions) {
    const list = builders.get(opt.builderName) ?? [];
    list.push({ option: opt.option, valueText: opt.valueText });
    builders.set(opt.builderName, list);
  }
  const anchors = [...builders.keys()];
  const files = candidateFiles(tree, anchors);

  const unhandleable: string[] = [];
  for (const filePath of files) {
    const content = tree.read(filePath, "utf-8") ?? "";
    for (const [builderName, options] of builders) {
      if (!content.includes(`${builderName}(`)) continue;
      const result = relocateAtCallSites(content, builderName, options);
      for (const reason of result.unhandleable) {
        unhandleable.push(`${filePath}: ${reason}`);
      }
    }
  }

  if (blockers.length > 0 || unhandleable.length > 0) {
    logger.error(
      `Aborted — nothing changed. Resolve these, then re-run:\n  ${[...blockers, ...unhandleable].join("\n  ")}`,
    );
    return;
  }

  // 4a. Strip options from the builder files and drop now-unused value imports.
  for (const [filePath, options] of optionsByFile) {
    let content = tree.read(filePath, "utf-8") ?? "";
    content = stripBuilderOptions(content, options);
    for (const symbol of importSymbols) {
      content = removeNamedImportIfUnused(content, symbol);
    }
    tree.write(filePath, content);
  }

  // 4b. Re-apply options at every call site and ensure value imports.
  let filesChanged = 0;
  let callsRewritten = 0;
  for (const filePath of files) {
    let content = tree.read(filePath, "utf-8") ?? "";
    const before = content;
    const importsNeeded: string[] = [];
    for (const [builderName, options] of builders) {
      if (!content.includes(`${builderName}(`)) continue;
      const result = relocateAtCallSites(content, builderName, options);
      content = result.content;
      callsRewritten += result.rewritten;
      if (result.rewritten > 0) {
        for (const opt of options) {
          const value = opt.valueText.trim();
          if (importSymbols.has(value)) {
            content = ensureNamedImportWith(content, builderName, value);
            importsNeeded.push(value);
          }
        }
      }
    }
    if (content !== before) {
      tree.write(filePath, content);
      filesChanged += 1;
    }
  }

  await formatFiles(tree);

  logger.info(
    `Vanillaized ${packageName}/${schema.resource}: stripped ${allOptions.length} option(s); re-applied across ${callsRewritten} call site(s) in ${filesChanged} file(s).`,
  );
}

export default vanillaizeBuildersGenerator;
