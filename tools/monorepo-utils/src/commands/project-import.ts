// Script based on this tutorial (not using `git mv` as it was removing the files `.gitignore`)
// https://blog.jdriven.com/2021/04/how-to-merge-multiple-git-repositories/
import type { Command } from "commander";
import path from "path";
import util from "node:util";
import fs from "fs-extra";
import { getMonorepoBasePath } from "@bsport/typescript-monorepo-utils";
import child_process from "child_process";

const exec = util.promisify(child_process.exec);

/**
 * @param {string} targetPath
 * @param {string} fsPath
 * @param {{ branch: string, remote: string, tempDir: string, quiet: boolean }} options
 */
async function action(
  targetPath,
  fsPath,
  {
    branch,
    quiet,
    remote,
    tempDir,
    tempBranch,
    tempRemote,
    "no-clean-up": noCleanUp = false,
  },
) {
  let error;
  const print = (...msgs) => !quiet && console.log(...msgs);

  const repoAbsolutePath = path.resolve(process.cwd(), fsPath);

  if (!fs.existsSync(repoAbsolutePath)) {
    throw new Error(
      `Unresolved path "${repoAbsolutePath}", please provide a valid initial path`,
    );
  }

  try {
    await syncInitialRepository({ remote, branch, repoAbsolutePath, quiet });
    await prepareRepoForMerge({
      tempBranch,
      tempDir,
      repoAbsolutePath,
      quiet,
      fsPath,
      targetPath,
    });
    await mergeToMonorepo({
      repoAbsolutePath,
      targetPath,
      tempBranch,
      tempRemote,
      quiet,
    });
  } catch (e) {
    error = e;
    print("❌ An error occurred!");
  } finally {
    if (noCleanUp) {
      print("ℹ️ Cleanup script disabled.");
    } else {
      cleanup({
        quiet,
        error,
        tempBranch,
        tempRemote,
        branch,
        repoAbsolutePath,
        fsPath,
        targetPath,
      });
    }

    if (error) {
      console.log(
        `❌ ${error instanceof Error ? error.message : String(error)}`,
      );
      console.error(error);
    }
  }
}

async function syncInitialRepository({
  remote,
  branch,
  repoAbsolutePath,
  quiet,
}: {
  branch: string;
  quiet: boolean;
  remote: string;
  repoAbsolutePath: string;
}) {
  const print = (...msgs) => !quiet && console.log(...msgs);
  print(`⏳ Syncing initial repository with ${remote}/${branch}`);
  const isGitRepository =
    (
      await exec("git rev-parse --is-inside-work-tree", {
        cwd: repoAbsolutePath,
      })
    ).stdout === "true\n";
  if (!isGitRepository) {
    throw new Error(
      `Invalid path: ${repoAbsolutePath} is not a valid git repository`,
    );
  }
  print(`> Git repository found at path ${repoAbsolutePath}`);
  try {
    print("> git diff --name-only --exit-code");
    await exec("git diff --name-only --exit-code", { cwd: repoAbsolutePath });
  } catch (e) {
    print("Changes not staged for commit:");
    print(e.stdout);
    throw new Error(
      "Some local changes have not been staged in the repository",
    );
  }
  try {
    print("> git diff --name-only --exit-code");
    await exec("git diff --name-only --exit-code", {
      cwd: await getMonorepoBasePath(),
    });
  } catch (e) {
    print("Changes not staged for commit:");
    print(e.stdout);
    throw new Error(
      "Some local changes have not been staged in the monorepository",
    );
  }
  print("No local change has been found.");
  print(`> git checkout ${branch}`);
  await exec(`git checkout --quiet ${branch}`, { cwd: repoAbsolutePath });
  print(`> git pull ${remote} ${branch}`);
  await exec(`git pull --quiet ${remote} ${branch}`, { cwd: repoAbsolutePath });
  print(`✅ Initial repository synced with ${remote}/${branch}`);
}
async function prepareRepoForMerge({
  tempBranch,
  tempDir,
  repoAbsolutePath,
  quiet,
  fsPath,
  targetPath,
}: {
  fsPath: string;
  quiet: boolean;
  repoAbsolutePath: string;
  targetPath: string;
  tempBranch: string;
  tempDir: string;
}) {
  const print = (...msgs) => !quiet && console.log(...msgs);

  const tempDirPath = path.resolve(await getMonorepoBasePath(), tempDir);
  print("⏳ Preparing repository for merge");
  try {
    print(`> git checkout -b ${tempBranch}`);
    await exec(`git checkout --quiet -b ${tempBranch}`, {
      cwd: repoAbsolutePath,
    });
  } catch (e) {
    print(`A branch named '${tempBranch}' already exists.`);
    print(`> git checkout ${tempBranch}`);
    await exec(`git checkout --quiet ${tempBranch}`, { cwd: repoAbsolutePath });
  }

  if (!fs.existsSync(tempDirPath)) {
    print(`> Create cache folder: ${tempDirPath}`);
    fs.mkdirSync(tempDirPath);
  } else {
    print(`> Clear cache folder: ${tempDirPath}`);
    await exec(`rm -rf ${tempDirPath}/*`);
  }

  print("> Move files and folders (except .git) to cache folder");

  const files = fs.readdirSync(repoAbsolutePath).filter((f) => f !== ".git");

  files.forEach((file) => {
    fs.renameSync(`${repoAbsolutePath}/${file}`, `${tempDirPath}/${file}`);
  });

  if (!fs.existsSync(path.resolve(fsPath, targetPath))) {
    print(`> Create folder ${targetPath} in initial project`);
    fs.mkdirSync(path.resolve(fsPath, targetPath), { recursive: true });
  }

  print(`> Load files from cache to ${targetPath}`);
  fs.renameSync(tempDirPath, path.resolve(fsPath, targetPath));

  const packageJsonPath = path.resolve(fsPath, targetPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    fs.writeJSONSync(packageJsonPath, {
      name: `${targetPath}`,
      version: "0.0.0",
      description: "",
    });
    print("✅ Created base package.json with new name");
  } else {
    const packageJson = fs.readJSONSync(packageJsonPath);
    packageJson.name = `${packageJson.name}`;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8",
    );
    print("✅ Update package.json with new name");
  }

  print("> git add -A");
  await exec("git add -A", { cwd: repoAbsolutePath });
  print(
    `> git commit -m "feature: migration to monorepo project ${targetPath}"`,
  );
  await exec(
    `git commit -m "feature: migration to monorepo project ${targetPath}"`,
    { cwd: repoAbsolutePath },
  );

  print("✅ Repository ready to be merged");
}
async function mergeToMonorepo({
  repoAbsolutePath,
  targetPath,
  tempBranch,
  tempRemote,
  quiet,
}: {
  quiet: boolean;
  repoAbsolutePath: string;
  targetPath: string;
  tempBranch: string;
  tempRemote: string;
}) {
  const monorepoBasePath = await getMonorepoBasePath();
  const print = (...msgs) => !quiet && console.log(...msgs);
  print("⏳ Merging to monorepository");
  print(`> git remote add -f ${tempRemote} ${repoAbsolutePath}`);
  await exec(`git remote add -f ${tempRemote} ${repoAbsolutePath}`, {
    cwd: monorepoBasePath,
  });
  print(
    `> git merge -m "feature: imported ${targetPath}" ${tempRemote}/${tempBranch} --allow-unrelated-histories`,
  );
  await exec(
    `git merge -m "feature: imported ${targetPath}" ${tempRemote}/${tempBranch} --allow-unrelated-histories`,
    { cwd: monorepoBasePath },
  );
  print("✅ Merged to monorepository");
}
async function cleanup({
  quiet,
  error,
  tempBranch,
  tempRemote,
  branch,
  repoAbsolutePath,
  fsPath,
  targetPath,
}: {
  quiet: boolean;
  error: boolean;
  tempBranch: string;
  tempRemote: string;
  branch: string;
  repoAbsolutePath: string;
  fsPath: string;
  targetPath: string;
}) {
  const print = (...msgs) => !quiet && console.log(...msgs);
  print("⏳ Clearing temp branches and remotes");
  if (!error) print("> Clear cache folder");
  await exec(`rm -rf ${tempBranch}`);

  if (fs.existsSync(path.resolve(fsPath, targetPath))) {
    print("> Clear target folder");
    await exec(`rm -rf ${path.resolve(fsPath, targetPath)}`);
  }

  try {
    if (!error) print(`> git remote remove ${tempRemote}`);
    await exec(`git remote remove ${tempRemote}`, {
      cwd: await getMonorepoBasePath(),
    });
  } catch (e) {
    if (!error) print(`remote ${tempRemote} already removed`);
  }
  if (!error) print(`> git checkout --force ${branch}`);
  await exec(`git checkout --force ${branch}`, { cwd: repoAbsolutePath });

  try {
    if (!error) print(`> git branch -D ${tempBranch}`);
    await exec(`git branch -D ${tempBranch}`, { cwd: repoAbsolutePath });
  } catch (e) {
    if (!error) print(`branch ${tempBranch} not found`);
  }
  print("✅ Temp branches and remotes cleared");
}

export default async function importProject(program: Command) {
  program
    .command("project:import")
    .description(
      "Imports a local project structure with all git commits to a monorepo.",
    )
    .argument(
      "<target-path>",
      "Monorepo path where the project will be imported (ex: apps/services/core/map).",
    )
    .argument(
      "<filesystem-path>",
      "Filesystem path where the repository is currently located.",
    )
    .option(
      "-b, --branch <branch>",
      "branch from which the project will be imported.",
      "master",
    )
    .option(
      "-r, --remote <remote>",
      "remote from which the project will be imported.",
      "origin",
    )
    .option(
      "--tempDir <tempDir>",
      "temporary cache directory that will be used to copy files",
      path.relative(
        await getMonorepoBasePath(),
        path.resolve(__dirname, "__tmp__"),
      ),
    )
    .option(
      "--tempBranch <tempBranch>",
      "temporary branch used in the project's repository to make the migration.",
      "temp/prepare_monorepo",
    )
    .option(
      "--tempRemote <tempRemote>",
      "temporary remote added in the monorepo to import the project.",
      "temp",
    )
    .option(
      "--no-clean-up",
      "disables the post script clean-up that removes temporary folders, remotes and branches.",
      false,
    )
    .option(
      "-q, --quiet",
      "suppress all output, unless an error occurs.",
      false,
    )
    .action(action);
  return program;
}
