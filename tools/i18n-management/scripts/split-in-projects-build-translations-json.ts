import path from "path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readJSONSync,
  removeSync,
} from "fs-extra";
import { mergeFiles } from "json-merger";
import { LOCALES, LANGUAGES } from "../src";
import { getProjectList, type ProjectConfig } from "./utils";

function main() {
  // Step 1 : List all projects with i18n folder
  const projectList = getProjectList();

  // Step 2 : Iterate through locales to split the translations to each project
  console.group("> Build translations files for :");
  LOCALES.forEach((locale: string) => {
    console.log(`- ${locale}`);
    splitLocaleTranslationsBetweenProjects({ locale, projectList });
  });
  console.groupEnd();
}

function splitLocaleTranslationsBetweenProjects({
  locale,
  projectList,
}: {
  locale: string;
  projectList: Array<ProjectConfig>;
}) {
  // Get path to the translations.json file of the locale
  const translationsPath = path.resolve(
    process.cwd(),
    `src/locales/${locale}.translations.json`,
  );
  if (!existsSync(translationsPath)) {
    return;
  }

  // Retrieve locale translations object
  let translations;
  if (locale === LANGUAGES.ENGLISH) {
    // By default, propagate values from the source translations file
    // to the en translations file.
    const sourceTranslationsFilePath = path.resolve(
      process.cwd(),
      "src/source/translations.json",
    );
    translations = mergeFiles([sourceTranslationsFilePath, translationsPath]);
  } else {
    translations = readJSONSync(translationsPath);
  }

  // Iterate through project name to get the associated strings
  for (const projectConfig of projectList) {
    const { name, pathToPublicLocales } = projectConfig;
    const projectTranslations = translations[name];
    if (!projectTranslations) {
      continue;
    }
    updateProjectTranslations({
      locale,
      translations: projectTranslations,
      pathToPublicLocales,
    });
  }
}

/**
 * Upload project/public/locales/[locale]/[namespace].translations.json files
 * Based on the localeTranslations JSON object.
 */
function updateProjectTranslations({
  locale,
  translations,
  pathToPublicLocales,
}: {
  locale: string;
  translations: object;
  pathToPublicLocales: string;
}) {
  // Recreate the public/locales/[locale] folder
  const pathToCurrentLocaleDir = path.resolve(pathToPublicLocales, locale);
  if (existsSync(pathToCurrentLocaleDir)) {
    removeSync(pathToCurrentLocaleDir);
  }
  mkdirSync(pathToCurrentLocaleDir, { recursive: true });

  // Populate dir with namespaced translations file
  Object.entries(translations).map(([namespaceName, namespaceTranslations]) => {
    const namespaceTranslationsPath = path.resolve(
      pathToCurrentLocaleDir,
      `${namespaceName}.json`,
    );
    writeFileSync(
      namespaceTranslationsPath,
      JSON.stringify(namespaceTranslations, null, 2),
    );
  });
}

main();
