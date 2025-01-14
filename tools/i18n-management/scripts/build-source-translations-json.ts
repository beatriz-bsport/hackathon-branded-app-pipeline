import path from "path";
import { readJSONSync, existsSync, writeFileSync, mkdirSync } from "fs-extra";
import beautify from "json-beautify";
import { getInternationalizedApplications, type ProjectConfig } from "./utils";

async function main() {
  // Step 1 : List all projects with i18n folder
  const projectList = getInternationalizedApplications();

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
  if (!existsSync(sourceDir)) {
    mkdirSync(sourceDir);
  }
  const sourceTranslationsPath = path.resolve(sourceDir, "translations.json");
  writeFileSync(
    sourceTranslationsPath,
    beautify(projectsMap, null as any, 2, 80),
  );
}

async function generateProjectTranslations({
  projectConfig,
}: {
  projectConfig: ProjectConfig;
}) {
  const { pathToI18n, name } = projectConfig;
  const errorMessage = `Failed to build translations object for ${name}:`;

  // Retrieve namespace list
  const namespaceListPath = path.resolve(pathToI18n, "namespaces.json");
  if (!existsSync(namespaceListPath)) {
    console.error(errorMessage, "File src/i18n/namespaces.json does not exist");
    return {};
  }
  const namespaceList: string[] = readJSONSync(namespaceListPath);
  if (!namespaceList?.length) {
    return {};
  }

  // Retrieve [namespace].translations.js in translations/
  try {
    const translationsPath = path.resolve(
      projectConfig.pathToI18n,
      "translations",
    );

    const aggregatedTranslations: { [namespace: string]: object } = {};

    for (const namespace of namespaceList) {
      const filePath = getNamespaceTranslationsPath({
        translationsFolder: translationsPath,
        namespace,
      });
      if (!filePath) {
        continue; // Skip if no file path is found
      }

      const fileContent: object = await require(filePath).default;
      aggregatedTranslations[namespace] = fileContent;
    }

    return aggregatedTranslations;
  } catch (error) {
    console.error(errorMessage, "Fail to concat src/i18n/translations/ files");
    return {};
  }
}

/**
 * Given a namespace, and a folder path will all translations files (.js, .ts),
 * Return the adequate path of the file containing the translations of that namespace.
 */
function getNamespaceTranslationsPath({
  translationsFolder,
  namespace,
}: {
  translationsFolder: string;
  namespace: string;
}) {
  const filePathTs = path.resolve(
    translationsFolder,
    `${namespace}.translations.ts`,
  );
  const filePathJs = path.resolve(
    translationsFolder,
    `${namespace}.translations.js`,
  );
  if (existsSync(filePathTs)) {
    return filePathTs;
  } else if (existsSync(filePathJs)) {
    return filePathJs;
  } else {
    console.warn(`Could not find ${filePathTs} or ${filePathJs}`);
    return "";
  }
}

main();
