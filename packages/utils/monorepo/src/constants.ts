import path from "path";
import fs from "fs";
import { promisify } from "node:util";
import { exec as execCb } from "child_process";

const exec = promisify(execCb);

/**
 * Provides to the absolute path of the Monorepository root.
 */
export const getMonorepoBasePath = async () => {
  const { stdout } = await exec(`pnpm run -w --silent pwd`, {
    cwd: __dirname,
  });
  const result = stdout.trim();
  const isPathValid = path.isAbsolute(result) && fs.existsSync(result);
  if (!isPathValid) {
    throw new Error(`Invalid output for command "pnpm run -w pwd": ${stdout}`);
  }
  return stdout;
};
