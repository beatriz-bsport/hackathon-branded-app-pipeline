import fs from "node:fs";
import os from "node:os";

type ActionParameters = {
  filename: string;
  name: string;
  value: string;
  overrideOnly?: boolean;
};

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
}: ActionParameters) {
  try {
    const envFileLines = fs.readFileSync(filename, "utf8").split(os.EOL);
    const existingLine = envFileLines.find((line) => {
      return line.toLowerCase().startsWith(name.toLowerCase());
    });

    if (overrideOnly && !existingLine) {
      return;
    }

    const targetIndex = existingLine ? envFileLines.indexOf(existingLine) : 0;

    // replace the name/value with the new value
    envFileLines.splice(targetIndex, 1, `${name}=${value}`);

    // write everything back to the file system
    fs.writeFileSync(filename, envFileLines.join(os.EOL));
  } catch (error) {
    console.error(error);
    throw new Error(
      `❌ Failed to declare ${name} with value ${value} in ${filename}`,
    );
  }
}
