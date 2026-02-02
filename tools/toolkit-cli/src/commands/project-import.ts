// Script based on this tutorial (not using `git mv` as it was removing the files `.gitignore`)
// https://blog.jdriven.com/2021/04/how-to-merge-multiple-git-repositories/
import child_process from "child_process";
import type { Command } from "commander";
import fs from "fs-extra";
import util from "node:util";
import path from "path";

import { getMonorepoBasePath } from "@bsport/typescript-monorepo-utils";

const exec = util.promisify(child_process.exec);

function getPrintFns({ quiet }: { quiet: boolean }) {
  return {
    print: (...msgs) => !quiet && console.log(...msgs),
    printGroup: (...msgs) => !quiet && console.group(...msgs),
    printGroupEnd: () => !quiet && console.groupEnd(),
  };
}

type PrintFn = (...msg: string[]) => void;

/**
 * @param {string} targetPath
 * @param {string} fsPath
 * @param {{ branch: string, remote: string, tempDir: string | undefined, quiet: boolean }} options
 */
async function action(
  targetPath,
  fsPath,
  { branch, quiet, remote, tempDir, tempBranch, tempRemote, noCleanUp },
) {
  let error;
  const { print, printGroup, printGroupEnd } = getPrintFns({ quiet });

  printGroup("\n\t🚀    Start importing project    🚀");

  const repoAbsolutePath = path.resolve(process.cwd(), fsPath);

  if (!fs.existsSync(repoAbsolutePath)) {
    throw new Error(
      `Unresolved path "${repoAbsolutePath}", please provide a valid initial path`,
    );
  }

  try {
    print("\n---------------------------------------------------\n");

    await syncInitialRepository({
      quiet,
      remote,
      branch,
      repoAbsolutePath,
    });

    print("\n---------------------------------------------------\n");

    await prepareRepoForMerge({
      quiet,
      tempBranch,
      tempDir,
      repoAbsolutePath,
      targetPath,
    });

    print("\n---------------------------------------------------\n");

    await mergeToMonorepo({
      quiet,
      repoAbsolutePath,
      targetPath,
      tempBranch,
      tempRemote,
    });

    print("\n---------------------------------------------------\n");
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
  printGroupEnd();
}

async function syncInitialRepository({
  quiet,
  remote,
  branch,
  repoAbsolutePath,
}: {
  quiet: boolean;
  branch: string;
  remote: string;
  repoAbsolutePath: string;
}) {
  const { print, printGroup, printGroupEnd } = getPrintFns({ quiet });

  printGroup(`⏳ Syncing initial repository with ${remote}/${branch}`);

  printGroup("\n1️⃣  Check initial repository is a git repository");
  await _checkRepositoryIsAGitRepository({ print, repoAbsolutePath });
  printGroupEnd();

  printGroup(`\n2️⃣  Check initial repository has no unstaged changes`);
  await _checkRepositoryHasNotUnstagedChanges({
    print,
    repositoryLocalPath: repoAbsolutePath,
    repositoryHint: "initial repository",
  });
  printGroupEnd();

  printGroup(`\n3️⃣  Check monorepository has no unstaged changes`);
  const monorepoBasePath = await getMonorepoBasePath();
  await _checkRepositoryHasNotUnstagedChanges({
    print,
    repositoryLocalPath: monorepoBasePath,
    repositoryHint: "monorepository",
  });
  printGroupEnd();

  printGroup("\n4️⃣  Sync initial repository with its remote version");
  await _syncInitialWithRemote({ print, repoAbsolutePath, branch, remote });
  printGroupEnd();

  print(`\n✅ Initial repository synced with ${remote}/${branch}`);

  printGroupEnd();
}

async function _checkRepositoryIsAGitRepository({
  print,
  repoAbsolutePath,
}: {
  print: PrintFn;
  repoAbsolutePath: string;
}) {
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
  } else {
    print(`¤ Git repository found at path ${repoAbsolutePath}`);
  }
}

async function _checkRepositoryHasNotUnstagedChanges({
  print,
  repositoryLocalPath,
  repositoryHint,
}: {
  print: PrintFn;
  repositoryLocalPath: string;
  repositoryHint: string;
}) {
  try {
    print("> git diff --name-only --exit-code");
    await exec("git diff --name-only --exit-code", {
      cwd: repositoryLocalPath,
    });
    print("¤ No local change has been found.");
  } catch (e) {
    print("! Changes not staged for commit");
    print(e.stdout);
    throw new Error(
      `Some local changes have not been staged in the ${repositoryHint}`,
    );
  }
}

async function _syncInitialWithRemote({
  print,
  repoAbsolutePath,
  branch,
  remote,
}: {
  print: PrintFn;
  repoAbsolutePath: string;
  branch: string;
  remote: string;
}) {
  print(`> git checkout ${branch}`);
  await exec(`git checkout --quiet ${branch}`, { cwd: repoAbsolutePath });
  print(`> git pull ${remote} ${branch} --rebase`);
  await exec(`git pull --quiet ${remote} ${branch} --rebase`, {
    cwd: repoAbsolutePath,
  });
}

async function prepareRepoForMerge({
  quiet,
  tempBranch,
  tempDir,
  repoAbsolutePath,
  targetPath,
}: {
  quiet: boolean;
  repoAbsolutePath: string;
  targetPath: string;
  tempBranch: string;
  tempDir: string | undefined;
}) {
  const { print, printGroup, printGroupEnd } = getPrintFns({ quiet });

  printGroup("⏳ Preparing initial repository for merge");

  printGroup(
    "\n1️⃣  Define temporary directory to move files, based on --temp-dir option",
  );
  const tempDirPath = await _getTempDirPath({ print, tempDir });
  printGroupEnd();

  printGroup("\n2️⃣  Create a temporary branch to prepare transfer");
  await _createTempBranch({ print, tempBranch, repoAbsolutePath });
  printGroupEnd();

  printGroup("\n3️⃣  Create cache folder in temp directory");
  await _createCacheFolder({ print, tempDirPath });
  printGroupEnd();

  printGroup("\n4️⃣  Move files and folders (except .git) to cache folder");
  await _moveFilesToCacheFolder({ print, repoAbsolutePath, tempDirPath });
  printGroupEnd();

  printGroup(
    "\n5️⃣  Move files and folders to targetPath in initial repository",
  );
  _moveFilesToTargetPath({
    print,
    tempDirPath,
    targetPath,
    initialRepoPath: repoAbsolutePath,
  });
  printGroupEnd();

  printGroup("\n6️⃣  Update pkg name to match monorepo structure");
  await _updatePackageJsonName({ print, targetPath, repoAbsolutePath });
  printGroupEnd();

  printGroup("\n7️⃣  Add and commit changes in initial repository temp branch");
  await _commitFileMovingToTempBranch({ print, repoAbsolutePath, targetPath });
  printGroupEnd();

  print("\n✅ Repository ready to be merged");

  printGroupEnd();
}

/**
 * Define a temporary folder path in monorepository to store files
 */
async function _getTempDirPath({
  print,
  tempDir,
}: {
  print: PrintFn;
  tempDir: string | undefined;
}) {
  try {
    const _tempDir =
      tempDir ??
      path.relative(
        await getMonorepoBasePath(),
        path.resolve(__dirname, "__tmp__"),
      );
    const tempDirPath = path.resolve(await getMonorepoBasePath(), _tempDir);
    print(`¤ Temp directory path is ${tempDirPath}`);
    return tempDirPath;
  } catch (_error) {
    throw new Error("Fail to get tempDirPath");
  }
}

/**
 * Create a new branch in initial repository where to make merge preparation
 */
async function _createTempBranch({
  print,
  tempBranch,
  repoAbsolutePath,
}: {
  print: PrintFn;
  tempBranch: string;
  repoAbsolutePath: string;
}) {
  try {
    print(`> git checkout -b ${tempBranch}`);
    await exec(`git checkout --quiet -b ${tempBranch}`, {
      cwd: repoAbsolutePath,
    });
  } catch (_e) {
    print(`! A branch named '${tempBranch}' already exists.`);
    print(`> git checkout ${tempBranch}`);
    await exec(`git checkout --quiet ${tempBranch}`, {
      cwd: repoAbsolutePath,
    });
  }
}

/**
 * Create cache directory based on the monorepository tempory dir path
 */
async function _createCacheFolder({
  print,
  tempDirPath,
}: {
  print: PrintFn;
  tempDirPath: string;
}) {
  if (!fs.existsSync(tempDirPath)) {
    print(`¤ Create cache folder: ${tempDirPath}`);
    fs.mkdirSync(tempDirPath);
  } else {
    print(`¤ Clear cache folder: ${tempDirPath}`);
    await exec(`rm -rf ${tempDirPath}/*`);
  }
}

/**
 * Move files from initial repository to cache folder
 */
function _moveFilesToCacheFolder({
  print,
  repoAbsolutePath,
  tempDirPath,
}: {
  print: PrintFn;
  repoAbsolutePath: string;
  tempDirPath: string;
}) {
  const filesToFilterOut = [".git"];
  const files = fs
    .readdirSync(repoAbsolutePath)
    .filter((f) => !filesToFilterOut.includes(f));
  files.forEach((file) => {
    fs.renameSync(`${repoAbsolutePath}/${file}`, `${tempDirPath}/${file}`);
  });
  print("¤ All files have been moved successfully !");
}

function _moveFilesToTargetPath({
  print,
  tempDirPath,
  targetPath,
  initialRepoPath,
}: {
  print: PrintFn;
  tempDirPath: string;
  targetPath: string;
  initialRepoPath: string;
}) {
  print("¤ Mirror the monorepository structure inside the initial repository");
  const targetPathInInitialRepo = path.resolve(initialRepoPath, targetPath);
  if (!fs.existsSync(targetPathInInitialRepo)) {
    print(`¤ Create folder ${targetPath} in initial project`);
    fs.mkdirSync(targetPathInInitialRepo, { recursive: true });
  }
  print(`¤ Load files from cache to ${targetPath}`);
  fs.renameSync(tempDirPath, targetPathInInitialRepo);
}

async function _updatePackageJsonName({
  print,
  repoAbsolutePath,
  targetPath,
}: {
  print: PrintFn;
  repoAbsolutePath: string;
  targetPath: string;
}) {
  const packageJsonPath = path.resolve(
    repoAbsolutePath,
    targetPath,
    "package.json",
  );
  const applicationName = targetPath.split("/").pop();

  // Update package name
  const newPackageName = `@bsport/${applicationName}`;
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeJSONSync(packageJsonPath, {
      name: newPackageName,
      version: "0.0.0",
      description: "",
    });
    print(`¤ Create package.json with new name ${applicationName}`);
  } else {
    const packageJson = fs.readJSONSync(packageJsonPath);
    packageJson.name = newPackageName;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8",
    );
    print(`¤ Update package.json with new name ${applicationName}`);
  }
}

async function _commitFileMovingToTempBranch({
  print,
  repoAbsolutePath,
  targetPath,
}: {
  print: PrintFn;
  repoAbsolutePath: string;
  targetPath: string;
}) {
  print("> git add -A");
  await exec("git add -A", { cwd: repoAbsolutePath });
  const oldRepositoryName = repoAbsolutePath.split("/").pop();
  print(
    `> git commit -m "migrate(${oldRepositoryName}): migration to monorepo project ${targetPath}"`,
  );
  await exec(
    `git commit -m "migrate(${oldRepositoryName}): migration to monorepo project ${targetPath}"`,
    { cwd: repoAbsolutePath },
  );
}

async function mergeToMonorepo({
  quiet,
  repoAbsolutePath,
  targetPath,
  tempBranch,
  tempRemote,
}: {
  quiet: boolean;
  repoAbsolutePath: string;
  targetPath: string;
  tempBranch: string;
  tempRemote: string;
}) {
  const { print, printGroup, printGroupEnd } = getPrintFns({ quiet });

  printGroup("⏳ Merging to monorepository");

  printGroup(
    "\n1️⃣  Add temp remote to monorepo pointing to initial repository",
  );
  await _addInitialRepoTempBranchAsRemote({
    print,
    tempRemote,
    repoAbsolutePath,
  });
  printGroupEnd();

  printGroup(
    "\n2️⃣  Merge the initial repository history inside monorepository",
  );
  await _mergeRemoteInMonorepository({
    print,
    tempRemote,
    tempBranch,
    targetPath,
  });
  printGroupEnd();

  print("\n✅ Merged to monorepository");

  printGroupEnd();
}

async function _addInitialRepoTempBranchAsRemote({
  print,
  tempRemote,
  repoAbsolutePath,
}: {
  print: PrintFn;
  tempRemote: string;
  repoAbsolutePath: string;
}) {
  const monorepoBasePath = await getMonorepoBasePath();
  print(`> git remote add -f ${tempRemote} ${repoAbsolutePath}`);
  try {
    await exec(`git remote add -f ${tempRemote} ${repoAbsolutePath}`, {
      cwd: monorepoBasePath,
    });
    print(`¤ Add remote.${tempRemote} pointing to ${repoAbsolutePath}`);
  } catch (_error) {
    print(`! remote.${tempRemote} already exists`);
    print(`¤ Update the remote destination to ${repoAbsolutePath}`);
    print(
      `> git remote set-url ${tempRemote} ${repoAbsolutePath} && git fetch ${tempRemote}`,
    );
    await exec(
      `git remote set-url ${tempRemote} ${repoAbsolutePath} && git fetch ${tempRemote}`,
      {
        cwd: monorepoBasePath,
      },
    );
  }
}

async function _mergeRemoteInMonorepository({
  print,
  tempRemote,
  tempBranch,
  targetPath,
}: {
  print: PrintFn;
  tempRemote: string;
  tempBranch: string;
  targetPath: string;
}) {
  const monorepoBasePath = await getMonorepoBasePath();
  print("¤ Set ECOSYSTEM_SKIP_HOOKS to true to skip commitizen");
  print(
    `> git merge -m "feature: imported ${targetPath}" ${tempRemote}/${tempBranch} --allow-unrelated-histories`,
  );
  await exec(
    `export ECOSYSTEM_SKIP_HOOKS=true; git merge -m "feature: imported ${targetPath}" ${tempRemote}/${tempBranch} --allow-unrelated-histories`,
    { cwd: monorepoBasePath },
  );
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
  const { print, printGroup, printGroupEnd } = getPrintFns({ quiet });

  printGroup("⏳ Clearing temp branches and remotes");

  if (!error) print("¤ Clear cache folder");
  await exec(`rm -rf ${tempBranch}`);

  if (fs.existsSync(path.resolve(fsPath, targetPath))) {
    print("¤ Clear target folder");
    await exec(`rm -rf ${path.resolve(fsPath, targetPath)}`);
  }

  try {
    if (!error) print(`> git remote remove ${tempRemote}`);
    await exec(`git remote remove ${tempRemote}`, {
      cwd: await getMonorepoBasePath(),
    });
  } catch (_e) {
    if (!error) print(`! remote ${tempRemote} already removed`);
  }

  const initialRepoCurrentGitBranch = (
    await exec("git rev-parse --abbrev-ref HEAD", { cwd: repoAbsolutePath })
  ).stdout.trim();
  if (initialRepoCurrentGitBranch === branch) {
    print(
      `! Manually handle or remove your changes on ${branch} from ${repoAbsolutePath}`,
    );
  } else {
    if (!error) print(`> git checkout --force ${branch}`);
    await exec(`git checkout --force ${branch}`, { cwd: repoAbsolutePath });
  }

  try {
    if (!error) print(`> git branch -D ${tempBranch}`);
    await exec(`git branch -D ${tempBranch}`, { cwd: repoAbsolutePath });
  } catch (_e) {
    if (!error) print(`! branch ${tempBranch} not found`);
  }
  print("\n✅ Temp branches and remotes cleared");

  printGroupEnd();
}

export default async function importProject(program: Command) {
  program
    .command("project:import")
    .description(
      "Imports a local project structure with all git commits to a monorepo.",
    )
    .argument(
      "<target-path>",
      "Monorepo path where the project will be imported (ex: apps/applications/saas).",
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
      undefined,
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
      "-ncu, --noCleanUp",
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
