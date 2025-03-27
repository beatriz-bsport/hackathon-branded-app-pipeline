import { exec as execCb, execSync } from "child_process";
import fs from "fs";
import { promisify } from "node:util";
import path from "path";

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
  return result;
};

/**
 * Return synchronously the absolute path of the Monorepository root
 */
export const getMonorepoBasePathSync = () => {
  const result = execSync("pnpm run -w --silent pwd").toString("utf-8").trim();
  const isPathValid = path.isAbsolute(result) && fs.existsSync(result);
  if (!isPathValid) {
    throw new Error(`Invalid output for command "pnpm run -w pwd"`);
  }
  return result;
};
