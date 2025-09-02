import { writeFileSync } from "fs-extra";
import beautify from "json-beautify";
import path from "path";

import {
  LEGACY_PROJECTS,
  type ProjectConfig,
  ensureDir,
  getAppNamespaces,
  getInternationalizedApplications,
  getNamespacesTranslations,
} from "./utils";

async function main() {
  // Step 1 : List all revamped projects with i18n old structure (aggregated translations in i18n-management)
  const projectList = (
    await getInternationalizedApplications({
      blacklist: LEGACY_PROJECTS,
    })
  ).filter((proj) => !proj.hasTransifexStructure);

  // Step 2 : Aggregate in a Js object all namespaces of all projects
  const projectsMap: { [namespace: string]: object } = {};
  for (const project of projectList) {
    const projectTranslations = await generateProjectTranslations({
      projectConfig: project,
    });
    projectsMap[project.name] = projectTranslations;
  }

  // Step 3 : Write output in JSON file
  const sourceDir = path.resolve(process.cwd(), "src/source");
  ensureDir(sourceDir);
  writeFileSync(
    path.resolve(sourceDir, "translations.json"),
    beautify(projectsMap, null as any, 2, 80),
  );
}

async function generateProjectTranslations({
  projectConfig,
}: {
  projectConfig: ProjectConfig;
}) {
  // Retrieve namespace list
  const namespaces = getAppNamespaces(projectConfig.pathToI18n);
  if (namespaces.length === 0) {
    console.error(
      `Failed to build translations object for ${projectConfig.name}:`,
      "File src/i18n/namespaces.json does not exist or is empty",
    );
    return {};
  }

  // Retrieve [namespace].translations.js in translations/
  return await getNamespacesTranslations({
    namespaces,
    pathToI18n: projectConfig.pathToI18n,
  });
}

main();
