import type { NXPrintAffectedOutput } from "./types";
import { promisify } from "node:util";
import { exec as execCb } from "child_process";
import { MONOREPO_BASE_PATH } from "./constants";

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
  const commandToExecute = "pnpm run --silent nx print-affected --all";
  try {
    const { stdout } = await exec(commandToExecute, {
      cwd: MONOREPO_BASE_PATH,
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
  } catch (e) {
    throw new Error(`Failed to parse output of "${commandToExecute}`);
  }
}
