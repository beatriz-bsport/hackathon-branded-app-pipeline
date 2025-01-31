import { existsSync } from "fs-extra";
import path from "path";
import { getProjectsPackageJsons } from "@bsport/typescript-monorepo-utils";

export type ProjectConfig = {
  name: string;
  pathToI18n: string;
  pathToPublicLocales: string;
};

/**
 * Retrieve all applications containing a right i18n configuration,
 * Meaning a src/i18n folder containing a translations folder and a namespaces.json file,
 * And return the adequate data to run the update script for translations.
 */
export async function getInternationalizedApplications() {
  const projects = await getProjectsPackageJsons({ isAbsolutePath: true });

  // Filter projects to keep only those with i18n
  const filteredProjectList: Array<ProjectConfig> = [];
  for (const projectConfig of Object.values(projects).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const { name: projectName, path: projectPath } = projectConfig;
    const i18nPath = path.join(projectPath, "/src/i18n");
    const publicLocalesPath = path.join(projectPath, "/public/locales");
    try {
      if (existsSync(i18nPath)) {
        filteredProjectList.push({
          name: projectName,
          pathToI18n: i18nPath,
          pathToPublicLocales: publicLocalesPath,
        });
      }
    } catch (error) {
      console.error(`Skip ${projectName} : Could not find src/i18n folder`);
    }
  }

  console.group(`\n> Projects with i18n configuration`);
  for (const project of filteredProjectList) {
    console.log(`- ${project.name}`);
  }
  console.groupEnd();

  return filteredProjectList;
}
