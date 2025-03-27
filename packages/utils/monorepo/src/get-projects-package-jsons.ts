import { exec as execCb } from "child_process";
import fs from "fs-extra";
import { promisify } from "node:util";
import { join as pathJoin, relative as pathRelative } from "path";
import type { PackageJson } from "type-fest";

import { getMonorepoBasePath } from "./constants";

const exec = promisify(execCb);

const DEFAULT_OPTIONS = { isAbsolutePath: false };

/**
 * Returns all the monorepository projects with their name, path and `package.json`.
 * @param options
 * @param options.isAbsolutePath If `true`, the path will be absolute. If `false`, the path will be relative to the monorepo base path.
 */
export async function getProjectsPackageJsons(
  options: { isAbsolutePath?: boolean } = DEFAULT_OPTIONS,
): Promise<{
  [projectName: string]: {
    path: string;
    name: string;
    packageJson: PackageJson;
  };
}> {
  const monorepoBasePath = await getMonorepoBasePath();
  const { stdout } = await exec("pnpm list -r --depth -1 --json", {
    cwd: monorepoBasePath,
  });
  const projects = JSON.parse(stdout) as Array<{
    name: string;
    path: string;
    version: string;
    private?: boolean;
  }>;
  const packageJSONs: PackageJson[] = await Promise.all(
    projects.map((project) =>
      fs.readJSON(pathJoin(project.path, "package.json")),
    ),
  );
  return projects.reduce(
    (acc, project) => {
      const packageJson = packageJSONs.find(
        ({ name }) => name === project.name,
      );
      return !packageJson
        ? acc
        : {
            ...acc,
            [project.name]: {
              name: project.name,
              path:
                options.isAbsolutePath || DEFAULT_OPTIONS.isAbsolutePath
                  ? project.path
                  : pathRelative(monorepoBasePath, project.path),
              packageJson,
            },
          };
    },
    {} as {
      [projectName: string]: {
        path: string;
        name: string;
        packageJson: PackageJson;
      };
    },
  );
}
