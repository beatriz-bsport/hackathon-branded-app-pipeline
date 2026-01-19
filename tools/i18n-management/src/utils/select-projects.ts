import { select as selectWithSearch } from "inquirer-select-pro";

import type { ProjectConfig } from "#src/types";

/** @todo Move script/utils in src/utils */
import { getInternationalizedApplications } from "../../scripts/utils";

/**
 * Allow to select multiple internationalized project
 * @param initialProjects Projects name to use, joined by a ","
 * @returns The list of ProjectConfig of the selected projects (either the provided or the selected ones)
 */
export async function selectProjects({
  initialProjects,
}: {
  initialProjects?: string;
}) {
  const projects = await getInternationalizedApplications({
    blacklist: ["@bsport/widget-legacy"],
  });

  // Validate the initialProject if provided
  if (initialProjects) {
    if (initialProjects === "*") {
      logSelection(projects);
      return projects;
    }

    const initialProjectList = initialProjects.split(",");

    // Validate the provided projects
    const wrongProjects: string[] = [];
    const projectConfigs = initialProjectList
      .map((projectName) => {
        const projectConfig = projects.find(
          (project) => project.name === projectName,
        );

        if (projectConfig) {
          return projectConfig;
        } else {
          wrongProjects.push(projectName);
          return undefined;
        }
      })
      .filter((config) => !!config);

    if (wrongProjects.length > 0) {
      console.error(
        `❌ Please fix the name of the following project before continuing: ${wrongProjects.join(",")}`,
      );
      process.exit(1);
    }

    logSelection(projectConfigs);
    return projectConfigs;
  }

  // Show a selector in the terminal to choose the project
  const projectConfigs = await selectWithSearch({
    message: "Select one or multiple projects to update.",
    multiple: true,
    canToggleAll: true,
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

  logSelection(projectConfigs);
  return projectConfigs;
}

function logSelection(projects: ProjectConfig[]) {
  console.info(
    `✅ Selected projects: ${projects.map((project) => project.name).join(",")}`,
  );
}
