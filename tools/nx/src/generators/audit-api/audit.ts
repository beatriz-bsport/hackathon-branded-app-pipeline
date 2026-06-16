import { Tree } from "@nx/devkit";

import {
  listResources,
  readResourceIndex,
  readRootBarrel,
  readSideEffects,
  resolveApiPackage,
  resourceSourceFiles,
  usesExportStar,
} from "../align-api-shared/api-package";
import {
  BuilderViolation,
  KeyFactoryViolation,
  analyzeKeyFactory,
  findBuilderViolations,
  findKeyFactories,
  parse,
} from "../align-api-shared/ast";
import { findRootBarrelImportSites } from "../align-api-shared/consumers";

export type ResourceFindings = {
  resource: string;
  resourceIndexExportStar: boolean;
  builderViolations: BuilderViolation[];
  keyViolations: KeyFactoryViolation[];
};

export type PackageAudit = {
  packageName: string;
  root: string;
  sideEffectsDeclaredFalse: boolean;
  rootBarrelExportStar: boolean;
  barrelImportSiteCount: number;
  barrelImportTopFiles: { file: string; count: number }[];
  resources: ResourceFindings[];
};

function analyzeResource(
  tree: Tree,
  root: string,
  resource: string,
): ResourceFindings {
  const builderViolations: BuilderViolation[] = [];
  const keyViolations: KeyFactoryViolation[] = [];

  for (const filePath of resourceSourceFiles(tree, root, resource)) {
    const content = tree.read(filePath, "utf-8");
    if (content === null) {
      continue;
    }
    const sourceFile = parse(content, filePath);

    builderViolations.push(...findBuilderViolations(sourceFile));

    for (const factory of findKeyFactories(sourceFile)) {
      keyViolations.push(...analyzeKeyFactory(factory.name, factory.node));
    }
  }

  return {
    resource,
    resourceIndexExportStar: usesExportStar(
      readResourceIndex(tree, root, resource),
    ),
    builderViolations,
    keyViolations,
  };
}

export function auditApiPackage(
  tree: Tree,
  input: string,
  resourceFilter?: string,
): PackageAudit {
  const { packageName, root } = resolveApiPackage(tree, input);

  const allResources = listResources(tree, root);
  const resources = resourceFilter
    ? allResources.filter((r) => r === resourceFilter)
    : allResources;

  if (resourceFilter && resources.length === 0) {
    throw new Error(
      `Resource "${resourceFilter}" not found in ${packageName}. Available: ${allResources.join(", ")}`,
    );
  }

  const sideEffects = readSideEffects(tree, root);
  const barrelSites = findRootBarrelImportSites(tree, packageName);

  return {
    packageName,
    root,
    sideEffectsDeclaredFalse: sideEffects === false,
    rootBarrelExportStar: usesExportStar(readRootBarrel(tree, root)),
    barrelImportSiteCount: barrelSites.reduce((sum, s) => sum + s.count, 0),
    barrelImportTopFiles: [...barrelSites]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    resources: resources.map((resource) =>
      analyzeResource(tree, root, resource),
    ),
  };
}

export function hasFindings(audit: PackageAudit): boolean {
  if (!audit.sideEffectsDeclaredFalse) return true;
  if (audit.rootBarrelExportStar) return true;
  if (audit.barrelImportSiteCount > 0) return true;
  return audit.resources.some(
    (r) =>
      r.resourceIndexExportStar ||
      r.builderViolations.length > 0 ||
      r.keyViolations.length > 0,
  );
}
