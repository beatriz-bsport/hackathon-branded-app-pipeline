/**
 * /! HISTORICAL SCRIPT FOR MIGRATION - NOT USED ANYMORE !\
 *
 * Context:
 * In the old frontend repository `bsport-saas`, the translations of the target languages where
 * built in the src/i18n/build folder.
 * After the migration from `bsport-saas` to `ichizen`, these locales translations were located at path
 * apps/applications/saas-legacy/src/i18n/build.
 * This script has be called once, to perform the final migration. It has been used to initialize
 * `i18n-management/src/locales/<lang>.translations.json` files, based on the previous build folders.
 */
import { readJsonSync, writeFileSync } from "fs-extra";
import beautify from "json-beautify";
import path from "path";

import { getMonorepoBasePathSync } from "@bsport/typescript-monorepo-utils";

import { LOCALES } from "../src";
import { getInternationalizedApplications } from "./utils";

type ProjectToImport = {
  name: string;
  translationsBuildFolder: string;
};

const SAAS_LEGACY_PROJECT: ProjectToImport = {
  name: "@bsport/saas-legacy",
  translationsBuildFolder: "apps/applications/saas-legacy/src/i18n/build",
};

async function main(projects: Array<ProjectToImport>) {
  console.log("⏳ Start building locales/[locale]/translations.json file");

  // Map name to translationsBuildFolder
  const projectsMap = new Map<string, ProjectToImport>();
  projects.forEach((project) => projectsMap.set(project.name, project));

  // Keep the same order as getInternationalizedApplications
  const projectsToImport = projects.map((project) => project.name);
  const projectList = (await getInternationalizedApplications())
    .filter((project) => projectsToImport.includes(project.name))
    .map((project) => projectsMap.get(project.name))
    .filter((project) => !!project);

  // Iterate through [locale] to join JSON files
  console.group("> Build locales translations files for :");
  for (const locale of LOCALES) {
    console.log(`- ${locale}`);
    writeLocaleJsonBuild({ locale, projectList });
  }
  console.groupEnd();

  console.log(
    "✅ Successfully aggregate existing locales translations files from projects",
  );
}

function writeLocaleJsonBuild({
  locale,
  projectList,
}: {
  locale: string;
  projectList: Array<ProjectToImport>;
}) {
  // Aggregate content
  const projectsMap = projectList.reduce((acc, project) => {
    const translationsPath = path.resolve(
      project.translationsBuildFolder,
      locale,
      "translations.json",
    );
    const projectTranslations = readJsonSync(translationsPath);

    return {
      ...acc,
      [project.name]: projectTranslations,
    };
  }, {});

  // Define path to build
  const localeTranslationsPath = path.resolve(
    getMonorepoBasePathSync(),
    "tools/i18n-management",
    `src/locales/${locale}.translations.json`,
  );

  // Write the JSON object to the final destination
  writeFileSync(localeTranslationsPath, beautify(projectsMap, null as any, 4));
}

main([SAAS_LEGACY_PROJECT]);
