import * as fs from "fs";
import { existsSync, readJSONSync } from "fs-extra";
import { select as selectWithSearch } from "inquirer-select-pro";
import path from "path";

import { getProjectsPackageJsons } from "@bsport/typescript-monorepo-utils";

// #region ----- TYPES --------------------------------------------------------

export type ProjectConfig = {
  /** Name of the project in package.json */
  name: string;
  /** Absolute path to the project in the codebase */
  pathToProject: string;
  /** Absolute path to the i18n folder of the project */
  pathToI18n: string;
  /** Absolute path to the /public/locales folder of the project */
  pathToPublicLocales: string;
  /** Whether the project has been migrated to the new i18n structure */
  hasTransifexStructure: boolean;
};

export type Translations = {
  [key: string]: string | Translations;
};

export type KeyValuePair = {
  flattenKey: string;
  value: string;
};

// endregion ------------------------------------------------------------------

// #region  ----- INTERNAL HELPERS --------------------------------------------

/**
 * Given a namespace, and a folder path will all translations files (.js, .ts),
 * Return the adequate path of the file containing the translations of that namespace.
 */
function _getNamespaceTranslationsPath({
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

/**
 * Transform a project into ProjectConfig object
 * @param projectName Name of the project.
 * @param projectPath Absolute path to the project.
 * @returns {ProjectConfig} An object representing a ProjectConfig
 */
export function _formatAsProjectConfig({
  projectName,
  projectPath,
}: {
  projectPath: string;
  projectName: string;
}): ProjectConfig | undefined {
  const i18nPath = path.join(projectPath, "src", "i18n");
  const publicLocalesPath = path.join(projectPath, "public", "locales");

  try {
    if (existsSync(i18nPath)) {
      return {
        name: projectName,
        pathToProject: projectPath,
        pathToI18n: i18nPath,
        pathToPublicLocales: publicLocalesPath,
        hasTransifexStructure: existsSync(path.resolve(i18nPath, "source")),
      };
    }
  } catch (error) {
    console.error(`Skip ${projectName} : Could not find src/i18n folder`);
  }
}

/**
 * Concatenate all the JSONs files of a directory into a JSON objects where first keys are filenames.
 * @param dirPath Path to the directory containing the JSON files
 * @returns JSON as an object
 */
function _joinDirJsonTranslations(dirPath: string) {
  if (!existsSync(dirPath)) {
    console.warn(`⚠️  Can not recognize path ${dirPath}`);
    return {};
  }

  const joinedTranslations: Translations = {};
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    // Ensure the entry is a file
    if (!entry.isFile()) continue;

    // Ensure the file is a JSON
    if (!entry.name.endsWith(".json")) continue;

    const namespacePath = path.resolve(dirPath, entry.name);
    const namespaceName = entry.name.replace(".json", "");
    joinedTranslations[namespaceName] = readJSONSync(namespacePath);
  }

  return joinedTranslations;
}

// #endregion -----------------------------------------------------------------

// #region ----- EXPORTED UTILS -----------------------------------------------

export const LEGACY_PROJECTS = ["@bsport/saas-legacy", "@bsport/widget-legacy"];

/**
 * Return the i18n prefix for the public files, used to prevent conflicts.
 * @param projectName Name of the internationalized project
 */
export const getProjectPrefix = (projectName: string) => {
  if (projectName === "@bsport/saas-legacy") return "";

  if (projectName.startsWith("@bsport/")) {
    return `${projectName.slice("@bsport/".length)}_`;
  }
  // Fallback: strip scope if any and replace separators
  const sanitized = projectName.replace(/^@/, "").replace("/", "_");
  return sanitized ? `${sanitized}_` : "";
};

/**
 * Retrieve all applications containing a src/i18n folder.
 * @param blacklist A list of project names to be filtered out of the list.
 * A list of internationalized project config (name, paths, version)
 */
export async function getInternationalizedApplications(params?: {
  blacklist?: Array<string>;
}) {
  const projects = await getProjectsPackageJsons({ isAbsolutePath: true });

  // Filter projects to keep only those with i18n
  const filteredProjectList: Array<ProjectConfig> = [];
  for (const project of Object.values(projects).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const { name: projectName, path: projectPath } = project;

    // Filter out legacy projects -> they have their own weblate project
    if ((params?.blacklist || []).includes(projectName)) {
      continue;
    }

    const projectConfig = _formatAsProjectConfig({ projectName, projectPath });
    if (projectConfig) {
      filteredProjectList.push(projectConfig);
    }
  }
  return filteredProjectList;
}

/**
 * Retrieve the ProjectConfig object related to the given projectName
 * @param projectName Project for which you want to retrieve the ProjectConfig
 * @returns A Promise containing the ProjectConfig, or undefined if the src/i18n folder does not exist
 */
export async function getProjectConfig(projectName: string) {
  const projects = await getProjectsPackageJsons({ isAbsolutePath: true });

  const project = projects[projectName];

  if (!project) {
    console.error(`❌ Unknown project: ${projectName}`);
    return undefined;
  }

  return _formatAsProjectConfig({
    projectName: project.name,
    projectPath: project.path,
  });
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
      const filePath = _getNamespaceTranslationsPath({
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
    console.error("❌ Fail to concat src/i18n/translations/ files");
    return {};
  }
}

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Allow to select one internationalized project
 * @param initialProject Project name to use, going through validation
 * @returns The ProjectConfig of the selected project (either the provided or the selected one)
 */
export async function selectProject(params?: { initialProject?: string }) {
  const projects = await getInternationalizedApplications();

  // Validate the initialProject if provided
  if (params?.initialProject) {
    // Validate the provided project
    const projectConfig = projects.find(
      (proj) => proj.name === params.initialProject,
    );

    if (projectConfig) {
      console.log(`✅ Selected project: ${projectConfig.name}`);
      return projectConfig;
    } else {
      console.error(
        "❌ Unknown project name provided. Make sure this is an internationalized project.",
      );
      process.exit(1);
    }
  }

  // Show a selector in the terminal to choose the project
  const projectConfig = await selectWithSearch({
    message: "Select your project",
    multiple: false,
    required: true,
    options: (input?: string) => {
      const baseList = projects.map((project) => ({
        name: project.name,
        value: project,
      }));

      if (!input) return baseList;

      return baseList.filter((option) => option.name.includes(input));
    },
  });

  if (projectConfig) {
    console.log(`✅ Selected project: ${projectConfig.name}`);
    return projectConfig;
  } else {
    console.error("❌ You did not select a project. Please select one.");
    process.exit(1);
  }
}

/**
 * Recursive function to get a flatten structure of a dictionary of translations.
 *
 * @param translations The dictionaries to be flatten
 * @param parentKey Only used inside the function itself for recursive call
 *
 * @return A list of KeyValuePair { flattenKey: string, value: string }
 *
 * @example
 * const translations = {
 *  key1: {
 *    nestedKey1: "Hello !",
 *    nestedKey2: {
 *      item1: "Bonjour !",
 *      item2: "Hola !",
 *    }
 *  },
 *  ...
 * };
 *
 * const flattenTranslations = getFlattenKeyValuePairs(translations);
 * // Equals to
 * [
 *  { flattenKey: "key1.nestedKey1", value: "Hello !" },
 *  { flattenKey: "key1.nestedKey2.item1", value: "Bonjour !" },
 *  { flattenKey: "key1.nestedKey2.item2", value: "Hola !" },
 *  ...
 * ]
 */
export function getFlattenKeyValuePairs(
  translations: Translations,
  parentKey: string = "",
): KeyValuePair[] {
  const keyValuePairs: KeyValuePair[] = [];

  for (const key in translations) {
    if (translations.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof translations[key] === "object") {
        keyValuePairs.push(
          ...getFlattenKeyValuePairs(translations[key], newKey),
        );
      } else {
        keyValuePairs.push({ flattenKey: newKey, value: translations[key] });
      }
    }
  }

  return keyValuePairs;
}

/**
 * Retrieve a unique JSON object containing all source translations of a project
 * @param project Config of the project to analyze
 */
export function getSourceTranslations(project: ProjectConfig): Translations {
  if (
    project.name === "@bsport/saas-legacy" &&
    !project.hasTransifexStructure
  ) {
    // Structure: i18n/source/translations.json
    const sourcePath = path.resolve(
      project.pathToI18n,
      "source",
      "translations.json",
    );
    if (existsSync(sourcePath)) {
      return readJSONSync(sourcePath);
    }
    return {};
  }

  if (project.hasTransifexStructure) {
    // Structure: i18n/source/{namespace}.json
    const sourceDir = path.resolve(project.pathToI18n, "source");
    return _joinDirJsonTranslations(sourceDir);
  } else {
    // Structure: i18n/locales/en/translations.json
    const sourcePath = path.resolve(
      project.pathToI18n,
      "locales",
      "en",
      "translations.json",
    );
    if (existsSync(sourcePath)) {
      return readJSONSync(sourcePath);
    }
    return {};
  }

  return {};
}

// #endregion -----------------------------------------------------------------
