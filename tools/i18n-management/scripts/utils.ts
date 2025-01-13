import { execSync } from "child_process";
import { existsSync } from "fs-extra";
import path from "path";
import { getMonorepoBasePathSync } from "@bsport/typescript-monorepo-utils";

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
export function getInternationalizedApplications() {
  // Retrieve all projects names
  const cmd = "pnpm exec nx show projects --json";
  const jsonOutput = execSync(cmd).toString("utf-8").trim();
  let projects: string[] = [];
  try {
    projects = JSON.parse(jsonOutput);
  } catch (error) {
    console.error(`Failed to parse projects from ${jsonOutput}`);
    return [];
  }

  // Filter projects to keep only those with i18n
  const monorepoBasePath = getMonorepoBasePathSync();
  const filteredProjectList: Array<ProjectConfig> = [];
  for (const projectName of projects) {
    try {
      const projectPath = getProjectPath({ projectName });
      const i18nPath = path.join(monorepoBasePath, projectPath, "/src/i18n");
      const publicLocalesPath = path.join(
        monorepoBasePath,
        projectPath,
        "/public/locales",
      );
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

/**
 * Given a project name, return the path to this project from the root
 */
function getProjectPath({ projectName }: { projectName: string }) {
  const cmd = `pnpm exec nx show project ${projectName} --json`;
  const jsonOutput = execSync(cmd).toString("utf-8").trim();
  const projectInfo = JSON.parse(jsonOutput);
  return projectInfo["root"];
}
