import { exec as execCb } from "child_process";
import { promisify } from "node:util";

import { getMonorepoBasePath } from "./constants";
import type { NXPrintAffectedOutput } from "./types";

const exec = promisify(execCb);

const DEFAULT_OPTIONS = {
  base: "origin/main",
  head: "HEAD",
};

/**
 * Returns all the monorepository projects' names affected by changes.
 * @param options
 * @param options.base The base branch to compare against. Defaults to `origin/main`.
 * @param options.head The head branch to compare against. Defaults to `HEAD`.
 */
export async function getAffectedProjects(
  options: {
    base?: string;
    head?: string;
  } = DEFAULT_OPTIONS,
): Promise<string[]> {
  const monorepoBasePath = await getMonorepoBasePath();
  const headOption = `--head=${options.head || DEFAULT_OPTIONS.head}`;
  const baseOption = `--base=${options.base || DEFAULT_OPTIONS.base}`;
  const commandToExecute = `pnpm run -w --silent nx print-affected ${baseOption} ${headOption}`;
  try {
    const { stdout } = await exec(commandToExecute, {
      cwd: monorepoBasePath,
    });
    const output = JSON.parse(stdout) as NXPrintAffectedOutput;
    return output.projects;
  } catch (_e) {
    throw new Error(`Failed to parse output of "${commandToExecute}`);
  }
}
