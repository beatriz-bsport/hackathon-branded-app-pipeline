import type { PackageJson } from "type-fest";
import { getAffectedProjects } from "./get-affected-projects";
import { getProjectsPackageJsons } from "./get-projects-package-jsons";

/**
 * Returns all the monorepository projects affected by changes with their name, path and `package.json`.
 * @param options
 * @param options.isAbsolutePath If `true`, the path will be absolute. If `false`, the path will be relative to the monorepo base path.
 * @param options.base The base branch to compare against. Defaults to `origin/main`.
 * @param options.head The head branch to compare against. Defaults to `HEAD`.
 */
export async function getAffectedProjectsPackageJsons(options?: {
  base?: string;
  head?: string;
  isAbsolutePath?: boolean;
}): Promise<{
  [projectName: string]: {
    path: string;
    name: string;
    packageJson: PackageJson;
  };
}> {
  const affectedProjects = await getAffectedProjects({
    head: options?.head,
    base: options?.base,
  });
  const projectsPackageJsons = await getProjectsPackageJsons({
    isAbsolutePath: options?.isAbsolutePath,
  });
  return affectedProjects.reduce(
    (acc, projectName: string) => {
      const projectPackageJson = projectsPackageJsons[projectName];
      return !projectPackageJson
        ? acc
        : {
            ...acc,
            [projectName]: projectPackageJson,
          };
    },
    {} as {
      [projectName: string]: {
        path: string;
        name: string;
        packageJson: PackageJson;
      };
    }
  );
}
