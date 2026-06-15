import { Tree, logger } from "@nx/devkit";

import { PackageAudit, auditApiPackage, hasFindings } from "./audit";

type AuditApiSchema = {
  appName: string;
  resource?: string;
};

function formatReport(audit: PackageAudit): string {
  const lines: string[] = [];
  lines.push(`ADR-0001 audit — ${audit.packageName}`);
  lines.push("");

  // Rule 3 — package level
  lines.push("Rule 3 — no root barrel:");
  lines.push(
    `  sideEffects: false ........ ${audit.sideEffectsDeclaredFalse ? "OK" : "MISSING"}`,
  );
  lines.push(
    `  root barrel export * ...... ${audit.rootBarrelExportStar ? "VIOLATION" : "OK"}`,
  );
  lines.push(`  root-barrel import sites .. ${audit.barrelImportSiteCount}`);
  if (audit.barrelImportTopFiles.length > 0) {
    for (const { file, count } of audit.barrelImportTopFiles) {
      lines.push(`      ${count}×  ${file}`);
    }
  }
  lines.push("");

  for (const resource of audit.resources) {
    const count =
      resource.builderViolations.length +
      resource.keyViolations.length +
      (resource.resourceIndexExportStar ? 1 : 0);
    lines.push(`• ${resource.resource} — ${count} finding(s)`);

    if (resource.resourceIndexExportStar) {
      lines.push(
        `    [3] index.ts uses \`export *\` — use explicit re-exports.`,
      );
    }
    for (const v of resource.builderViolations) {
      lines.push(`    [${v.rule}] ${v.detail}`);
    }
    for (const v of resource.keyViolations) {
      lines.push(`    [${v.rule}] ${v.factory}.${v.detail}`);
    }
  }

  lines.push("");
  lines.push(
    "Rule 2 (suspense / QueryBoundary) is advisory — review loading/error strategy at consumer call sites by hand.",
  );

  return lines.join("\n");
}

/**
 * Read-only ADR-0001 audit. Writes nothing to the tree; logs a findings report.
 * Doubles as the skill's standalone audit mode.
 */
export async function auditApiGenerator(
  tree: Tree,
  schema: AuditApiSchema,
): Promise<void> {
  const audit = auditApiPackage(tree, schema.appName, schema.resource);

  logger.info(formatReport(audit));

  if (!hasFindings(audit)) {
    logger.info(
      `\n${audit.packageName}${schema.resource ? `/${schema.resource}` : ""} is aligned with ADR-0001.`,
    );
  }
}

export default auditApiGenerator;
