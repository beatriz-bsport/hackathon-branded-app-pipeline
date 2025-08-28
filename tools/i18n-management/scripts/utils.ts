import * as fs from "fs";
import { existsSync, readJSONSync } from "fs-extra";
import path from "path";

import { getProjectsPackageJsons } from "@bsport/typescript-monorepo-utils";

export type ProjectConfig = {
  name: string;
  pathToI18n: string;
  pathToPublicLocales: string;
  hasTransifexStructure: boolean;
};

export type Translations = {
  [key: string]: string | Translations;
};

function getPrintFns({ quiet }: { quiet: boolean }) {
  return {
    print: (...msgs: any) => !quiet && console.log(...msgs),
    printError: (...msgs: any) => !quiet && console.error(...msgs),
    printGroup: (...msgs: any) => !quiet && console.group(...msgs),
    printGroupEnd: () => !quiet && console.groupEnd(),
  };
}

const PROJECTS_TO_FILTER_OUT = ["@bsport/saas-legacy", "@bsport/widget-legacy"];

/**
 * Retrieve all applications containing a right i18n configuration,
 * Meaning a src/i18n folder containing a translations folder and a namespaces.json file,
 * And return the adequate data to run the update script for translations.
 */
export async function getInternationalizedApplications(params?: {
  quiet?: boolean;
}) {
  const { printError, printGroup, printGroupEnd, print } = getPrintFns({
    quiet: !!params?.quiet,
  });
  const projects = await getProjectsPackageJsons({ isAbsolutePath: true });

  // Filter projects to keep only those with i18n
  const filteredProjectList: Array<ProjectConfig> = [];
  for (const projectConfig of Object.values(projects).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const { name: projectName, path: projectPath } = projectConfig;

    // Filter out legacy projects -> they have their own weblate project
    if (PROJECTS_TO_FILTER_OUT.includes(projectName)) {
      continue;
    }

    const i18nPath = path.join(projectPath, "/src/i18n");
    const publicLocalesPath = path.join(projectPath, "/public/locales");
    try {
      if (existsSync(i18nPath)) {
        filteredProjectList.push({
          name: projectName,
          pathToI18n: i18nPath,
          pathToPublicLocales: publicLocalesPath,
          hasTransifexStructure: existsSync(path.resolve(i18nPath, "source")),
        });
      }
    } catch (error) {
      printError(`Skip ${projectName} : Could not find src/i18n folder`);
    }
  }

  return filteredProjectList;
}

/**
 * Retrieve the list of namespaces of the project
 * @param pathToI18n Relative path from the root of ichizen to app i18n folder
 */
export function getAppNamespaces(pathToI18n: string): string[] {
  const namespaceListPath = path.resolve(pathToI18n, "namespaces.json");
  if (!existsSync(namespaceListPath)) {
    return [];
  }
  return readJSONSync(namespaceListPath);
}

/**
 * Retrieve and aggregate translations from *.translations.js/ts files of given namespaces
 * @param pathToI18n Relative path from the root of ichizen to app i18n folder
 * @param namespaces List of namespace to read and aggregate
 */
export async function getNamespacesTranslations({
  pathToI18n,
  namespaces,
}: {
  pathToI18n: string;
  namespaces: string[];
}) {
  try {
    const aggregatedTranslations: Translations = {};

    for (const namespace of namespaces) {
      const filePath = getNamespaceTranslationsPath({
        translationsFolder: path.resolve(pathToI18n, "translations"),
        namespace,
      });
      if (!filePath) {
        console.log(`Skip ${namespace} - Could not find a filepath`);
        continue; // Skip if no file path is found
      }

      const fileContent: Translations = await require(filePath).default;
      aggregatedTranslations[namespace] = fileContent;
    }

    return aggregatedTranslations;
  } catch (error) {
    console.error(error);
    console.error("Fail to concat src/i18n/translations/ files");
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

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
