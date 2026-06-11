import { Tree, formatFiles, logger, visitNotIgnoredFiles } from "@nx/devkit";

import {
  listResources,
  resolveApiPackage,
  resourceSourceFiles,
} from "../align-api-shared/api-package";
import { findKeyFactories, parse } from "../align-api-shared/ast";
import { CallRewrite, rewriteKeyCalls } from "../align-api-shared/key-rewrites";

type CanonicalizeKeysSchema = {
  appName: string;
  resource: string;
  /** Path to a JSON file: { factoryName?, factorySource, callRewrites }. */
  mapFile: string;
};

type KeyMap = {
  factoryName?: string;
  factorySource: string;
  callRewrites?: CallRewrite[];
};

const SEARCH_ROOTS = ["apps", "packages"];

function readMap(tree: Tree, mapFile: string): KeyMap {
  const raw = tree.read(mapFile, "utf-8");
  if (raw === null) {
    throw new Error(`Map file not found: ${mapFile}`);
  }
  const map = JSON.parse(raw) as KeyMap;
  if (typeof map.factorySource !== "string") {
    throw new Error(
      `Map file ${mapFile} must include a "factorySource" string.`,
    );
  }
  return map;
}

/** Swap the resource's key-factory object literal for the agent-authored one. */
function replaceFactoryLiteral(
  tree: Tree,
  root: string,
  resource: string,
  map: KeyMap,
): string {
  for (const filePath of resourceSourceFiles(tree, root, resource)) {
    const content = tree.read(filePath, "utf-8");
    if (content === null) {
      continue;
    }
    const factories = findKeyFactories(parse(content, filePath));
    const factory = map.factoryName
      ? factories.find((f) => f.name === map.factoryName)
      : factories.length === 1
        ? factories[0]
        : undefined;

    if (!factory) {
      continue;
    }

    const start = factory.node.getStart();
    const end = factory.node.getEnd();
    tree.write(
      filePath,
      content.slice(0, start) + map.factorySource.trim() + content.slice(end),
    );
    return factory.name;
  }

  throw new Error(
    `No key factory${map.factoryName ? ` named "${map.factoryName}"` : ""} found in ${resource}. ` +
      `If the resource has multiple factories, set "factoryName" in the map.`,
  );
}

/** Rewrite every `<factoryName>.<from>(...)` call across the workspace. */
function rewriteCallSites(
  tree: Tree,
  factoryName: string,
  callRewrites: CallRewrite[],
): { filesChanged: number; callsRewritten: number } {
  let filesChanged = 0;
  let callsRewritten = 0;
  const anchor = `${factoryName}.`;

  for (const searchRoot of SEARCH_ROOTS) {
    if (!tree.exists(searchRoot)) {
      continue;
    }
    visitNotIgnoredFiles(tree, searchRoot, (filePath) => {
      if (!/\.tsx?$/.test(filePath)) {
        return;
      }
      const content = tree.read(filePath, "utf-8");
      if (content === null || !content.includes(anchor)) {
        return;
      }
      const result = rewriteKeyCalls(content, factoryName, callRewrites);
      if (result.content !== content) {
        tree.write(filePath, result.content);
        filesChanged += 1;
        callsRewritten += result.count;
      }
    });
  }

  return { filesChanged, callsRewritten };
}

/**
 * Rule 4: replace a resource's key factory with the agent-authored canonical
 * literal, and rewrite every consumer call site for renamed / param-collapsed
 * keys. Tier insertion (4c) is consumer-transparent, so it needs no callRewrite.
 */
export async function canonicalizeKeysGenerator(
  tree: Tree,
  schema: CanonicalizeKeysSchema,
): Promise<void> {
  const { packageName, root } = resolveApiPackage(tree, schema.appName);

  const resources = listResources(tree, root);
  if (!resources.includes(schema.resource)) {
    throw new Error(
      `Resource "${schema.resource}" not found in ${packageName}. Available: ${resources.join(", ")}`,
    );
  }

  const map = readMap(tree, schema.mapFile);
  const factoryName = replaceFactoryLiteral(tree, root, schema.resource, map);

  const callRewrites = (map.callRewrites ?? []).filter(
    (r) => r.from !== r.to || r.collapseArgsToObject,
  );
  const { filesChanged, callsRewritten } = callRewrites.length
    ? rewriteCallSites(tree, factoryName, callRewrites)
    : { filesChanged: 0, callsRewritten: 0 };

  await formatFiles(tree);

  logger.info(
    `Canonicalized ${factoryName}; rewrote ${callsRewritten} call site(s) across ${filesChanged} file(s).`,
  );
}

export default canonicalizeKeysGenerator;
