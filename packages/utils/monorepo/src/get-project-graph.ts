import { exec as execCb } from "child_process";
import { promisify } from "node:util";

import { getMonorepoBasePath } from "./constants";
import type { NXPrintAffectedOutput } from "./types";

const exec = promisify(execCb);

/**
 * Returns all the monorepository projects' names with their dependencies.
 * @todo fix because of breaking change in last NX version
 * @param projects The projects to get the dependencies for.
 */
export async function getProjectsDependencies(projects?: string[]): Promise<{
  [projectName: string]: {
    dependencies: string[];
    usedBy: string[];
  };
}> {
  const monorepoBasePath = await getMonorepoBasePath();
  const commandToExecute = "pnpm exec --silent nx print-affected --all";
  try {
    const { stdout } = await exec(commandToExecute, {
      cwd: monorepoBasePath,
    });
    const { projectGraph } = JSON.parse(stdout) as NXPrintAffectedOutput;
    const dependencies = Object.entries(projectGraph.dependencies).reduce(
      (acc, [projectName, dependencies]) => ({
        ...acc,
        [projectName]: dependencies.map(({ target }) => target),
      }),
      {} as { [projectName: string]: string[] },
    );
    const dependenciesEntries = Object.entries(dependencies);
    return dependenciesEntries
      .filter(([projectName]) => !projects || projects.includes(projectName))
      .reduce(
        (acc, [projectName, dependencies]) => ({
          ...acc,
          [projectName]: {
            dependencies,
            usedBy: dependenciesEntries
              .filter(([, dependencies]) => dependencies.includes(projectName))
              .map(([projectName]) => projectName),
          },
        }),
        {},
      );
  } catch (_e) {
    throw new Error(`Failed to parse output of "${commandToExecute}`);
  }
}
