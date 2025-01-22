import path from "path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readJSONSync,
  removeSync,
} from "fs-extra";
import { mergeFiles } from "json-merger";
import beautify from "json-beautify";
import { getInternationalizedApplications, type ProjectConfig } from "./utils";
import { LOCALES, LANGUAGES } from "../src";

async function main() {
  // Step 1 : List all projects with i18n folder
  const projectList = await getInternationalizedApplications();

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
    const { name, pathToPublicLocales, pathToI18n } = projectConfig;
    const projectTranslations = translations[name];
    if (!projectTranslations) {
      continue;
    }
    updateProjectTranslations({
      locale,
      translations: projectTranslations,
      pathToPublicLocales,
      pathToI18n,
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
  pathToI18n,
}: {
  locale: string;
  translations: object;
  pathToPublicLocales: string;
  pathToI18n: string;
}) {
  // Write to the src/i18n/locales folders so that Nx can track the changes
  const pathToBuildDir = path.resolve(pathToI18n, "locales", locale);
  if (!existsSync(pathToBuildDir)) {
    removeSync(pathToBuildDir);
  }
  mkdirSync(pathToBuildDir, { recursive: true });
  const localeTranslationsPath = path.resolve(
    pathToBuildDir,
    "translations.json",
  );
  writeFileSync(localeTranslationsPath, beautify(translations, null as any, 4));

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
