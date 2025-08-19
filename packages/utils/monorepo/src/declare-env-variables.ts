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

    if (existingLine) {
      const targetIndex = envFileLines.indexOf(existingLine);
      // replace the name/value with the new value
      envFileLines.splice(targetIndex, 1, `${name}=${value}`);
    } else {
      // If the file is empty (single empty line), replace it; else append at the end
      if (envFileLines.length === 1 && envFileLines[0] === "") {
        envFileLines[0] = `${name}=${value}`;
      } else {
        envFileLines.push(`${name}=${value}`);
      }
    }

    // write everything back to the file system
    fs.writeFileSync(filename, envFileLines.join(os.EOL));
  } catch (error) {
    console.error(error);
    throw new Error(
      `❌ Failed to declare ${name} with value ${value} in ${filename}`,
    );
  }
}
