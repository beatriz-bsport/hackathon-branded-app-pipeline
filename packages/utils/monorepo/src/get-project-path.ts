import { execSync } from "node:child_process";

/**
 * Given a project name, return the path to this project from ichizen root
 */
export function getProjectPath({ projectName }: { projectName: string }) {
  const cmd = `pnpm exec nx show project ${projectName} --json`;
  try {
    const jsonOutput = execSync(cmd).toString("utf-8").trim();
    const projectInfo = JSON.parse(jsonOutput);
    return projectInfo["root"];
  } catch (error) {
    console.error(error);
    throw new Error(
      `❌ Failed to get project path. Something went wrong when running : ${cmd}`,
    );
  }
}
