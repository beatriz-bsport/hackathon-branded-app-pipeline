import { execSync } from "node:child_process";

/**
 * Create or replace environement variable in specified file
 *
 * @param filename Relative path to the .env file to edit
 * @param name Name of the env variable to edit or create
 * @param value Value to assign to the variable
 * @param overrideOnly Declare variable only if it exists in the file (the variable won't be created)
 */
export function declareEnvVariable({
  filename,
  name,
  value,
  overrideOnly,
}: {
  filename: string;
  name: string;
  value: string;
  overrideOnly?: boolean;
}) {
  try {
    // Exit if the variable does not exist and overrideOnly is true
    const variableExists =
      execSync(`cat ${filename} | grep ${name} | wc -l`)
        .toString("utf-8")
        .trim() !== "0";
    if (overrideOnly && !variableExists) {
      return;
    }
    // Drop line containing the variable if it exists
    execSync(`sed -i '/${name}/d' ${filename}`);
    // Write new line mapping name to value
    execSync(`echo "${name}=${value}" >> ${filename}`);
  } catch (error) {
    console.error(error);
    throw new Error(
      `❌ Failed to declare ${name} with value ${value} in ${filename}`,
    );
  }
}
