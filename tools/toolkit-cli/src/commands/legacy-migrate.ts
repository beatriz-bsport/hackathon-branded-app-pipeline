import child_process from "child_process";
import type { Command } from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import util from "node:util";
import path from "path";

import { getMonorepoBasePath } from "@bsport/typescript-monorepo-utils";

import {
  MAP_PROJECT_TO_ID,
  getBranchesCreatedInLastXMonths,
  getBranchesRelatedToOpenMR,
} from "./open-branch-list";

const exec = util.promisify(child_process.exec);

type PrintFn = (...msg: string[]) => void;

function getPrintFns({ quiet }: { quiet: boolean }) {
  return {
    print: (...msgs) => !quiet && console.log(...msgs),
    printGroup: (...msgs) => !quiet && console.group(...msgs),
    printGroupEnd: () => !quiet && console.groupEnd(),
  };
}

type Project = "bsport-saas" | "bsport-widget";

const MAP_PROJECT_TO_MONOREPO_FOLDER: Record<Project, string> = {
  "bsport-saas": "apps/applications/saas-legacy",
  "bsport-widget": "apps/widgets/widget-legacy",
};

async function action({
  quiet,
  baseBranch,
}: {
  quiet: boolean;
  baseBranch: string;
}) {
  const { print, printGroup, printGroupEnd } = getPrintFns({ quiet });

  printGroup("\n\t🚀    Start migrating a legacy project    🚀");

  print("\nLet's kill that 😎");

  printGroup(
    "\n1️⃣  Prepare your local repositories for the incoming migration\n",
  );
  const { project, fsPath } = await prepareMigration({ print });
  printGroupEnd();

  printGroup(`\n2️⃣  Import 'dev' environment of ${project}\n`);
  const { devImportBranch, tempBranch, tempRemote } = await importDevProject({
    baseBranch,
    fsPath,
    project,
    print,
  });
  printGroupEnd();

  printGroup(`\n3️⃣  Import open branches of ${project}\n`);
  await importOpenBranches({
    baseBranch,
    devImportBranch,
    fsPath,
    print,
    project,
    tempBranch,
    tempRemote,
  });
  printGroupEnd();

  printGroup(`\n4️⃣  Clean the 'dev' import of ${project}\n`);
  await cleanDevProject({ devImportBranch, print, project });
  printGroupEnd();

  print(`\n✅ Complete the migration of ${project} !`);
  printGroupEnd();
}

async function _getCurrentGitBranch() {
  const monorepoBasePath = await getMonorepoBasePath();
  return (
    await exec("git rev-parse --abbrev-ref HEAD", { cwd: monorepoBasePath })
  ).stdout.trim();
}

async function _switchBranch({
  branchName,
  repoBasePath,
}: {
  branchName: string;
  repoBasePath: string;
}) {
  const branchAlreadyExists =
    (
      await exec(`git branch | grep ${branchName} | wc -l`, {
        cwd: repoBasePath,
      })
    ).stdout.trim() !== "0";
  if (branchAlreadyExists) {
    await exec(`git checkout ${branchName}`, {
      cwd: repoBasePath,
    });
  } else {
    await exec(`git switch -c ${branchName} origin/${branchName}`, {
      cwd: repoBasePath,
    });
  }
}

function _handleError(error) {
  if (error.isTtyError) {
    throw new Error("❌ The script can not be run in the current environment");
  } else {
    console.error("❌ Something went wrong !");
    throw error;
  }
}

async function prepareMigration({ print }: { print: PrintFn }) {
  const selectedProject = await _inquirerSelectProject();

  await _inquirerCheckLocalRepository({
    project: selectedProject,
  });

  const localRepositoryFsPath = await _inquirerDefineFilesystemPath({
    project: selectedProject,
  });

  await _checkGitRepositoryWithoutChanges({
    filesystemPath: localRepositoryFsPath,
  });

  await _inquirerCheckMonorepository();

  await _checkMonorepositoryWithoutChanges();

  print(
    "\n✅ Your local setup is ready, now we can start the dev migration !\n",
  );

  return {
    project: selectedProject,
    fsPath: localRepositoryFsPath,
  };
}

async function _inquirerSelectProject(): Promise<Project> {
  const inquirerName = "select-project";
  return inquirer
    .prompt([
      {
        type: "list",
        name: inquirerName,
        message: "Which legacy project would you like to import ?",
        choices: ["bsport-saas", "bsport-widget"],
      },
    ])
    .then((answers) => answers[inquirerName])
    .catch(_handleError);
}

async function _inquirerCheckLocalRepository({
  project,
}: {
  project: Project;
}): Promise<void> {
  const inquirerNameConfirmLocal = "confirm-local-repository";
  const inquirerNameConfirmNoChanges = "confirm-no-changes";
  const inquirerNameConfirmCloneAndNoChanges = "confirm-clone-and-no-changes";
  return inquirer
    .prompt([
      {
        type: "confirm",
        name: inquirerNameConfirmLocal,
        message: `Please confirm that you have locally the ${project} repository.`,
      },
      {
        type: "confirm",
        name: inquirerNameConfirmNoChanges,
        message: `Great ! Please confirm that you don't have any unstaged changes on your local ${project}.`,
        when(answers) {
          return answers[inquirerNameConfirmLocal];
        },
      },
      {
        type: "confirm",
        name: inquirerNameConfirmCloneAndNoChanges,
        message: `Go clone the repo, and confirm you have any unstaged changes on your local ${project}.`,
        when(answers) {
          return !answers[inquirerNameConfirmLocal];
        },
      },
    ])
    .then((answers) => {
      const hasGitRepoWithoutChanges =
        answers[inquirerNameConfirmLocal] &&
        answers[inquirerNameConfirmNoChanges];
      const hasClonedGitRepoWithoutChanges =
        !answers[inquirerNameConfirmLocal] &&
        answers[inquirerNameConfirmCloneAndNoChanges];
      const canCheckGitRepo =
        hasGitRepoWithoutChanges || hasClonedGitRepoWithoutChanges;
      if (!canCheckGitRepo) {
        throw new Error(
          "❌ Stop the execution of the script. Please fix your local git repo before running the migrate legacy script.",
        );
      }
    })
    .catch(_handleError);
}

async function _inquirerDefineFilesystemPath({
  project,
}: {
  project: Project;
}) {
  const inquirerName = "define-filesystem-path";
  const monorepoBasePath = await getMonorepoBasePath();
  return inquirer
    .prompt([
      {
        type: "input",
        name: inquirerName,
        message: `Please define the filesystem path to your local ${project}.`,
        default: monorepoBasePath.replace(
          monorepoBasePath.split("/").pop(),
          project,
        ),
      },
    ])
    .then((answers) => answers[inquirerName])
    .catch(_handleError);
}

async function _checkGitRepositoryWithoutChanges({
  filesystemPath,
}: {
  filesystemPath: string;
}) {
  // Resolve to the repository
  const repoAbsolutePath = path.resolve(process.cwd(), filesystemPath);
  if (!fs.existsSync(repoAbsolutePath)) {
    throw new Error(
      `❌ Unresolved path "${repoAbsolutePath}", please provide a valid initial path`,
    );
  }

  // Check whether the location is a Git repository
  const isGitRepository =
    (
      await exec("git rev-parse --is-inside-work-tree", {
        cwd: repoAbsolutePath,
      })
    ).stdout === "true\n";
  if (!isGitRepository) {
    throw new Error(
      `❌ Invalid path: ${repoAbsolutePath} is not a valid git repository`,
    );
  }

  // Check there are no changes
  try {
    await exec("git diff --name-only --exit-code", {
      cwd: repoAbsolutePath,
    });
  } catch (_e) {
    throw new Error(
      `❌ Some local changes have not been staged in your local project repository.`,
    );
  }
}

async function _inquirerCheckMonorepository(): Promise<void> {
  const inquirerName = "confirm-no-unstaged-changes-on-monorepository";
  return inquirer
    .prompt([
      {
        type: "confirm",
        name: inquirerName,
        message:
          "Please confirm that you don't have any unstaged changes on your local monorepository.",
      },
    ])
    .catch(_handleError);
}

async function _checkMonorepositoryWithoutChanges() {
  const monorepoBasePath = await getMonorepoBasePath();
  try {
    await exec("git diff --name-only --exit-code", {
      cwd: monorepoBasePath,
    });
  } catch (_e) {
    throw new Error(
      `❌ Some local changes have not been staged in your local monorepository.`,
    );
  }
}

async function importDevProject({
  baseBranch,
  fsPath,
  print,
  project,
}: {
  baseBranch: string;
  fsPath: string;
  print: PrintFn;
  project: Project;
}) {
  const devImportBranch = await _inquirerDefineGitBranchName({
    project,
  });

  const { tempBranch, tempRemote } = await _processProjectImport({
    baseBranch,
    branchName: devImportBranch,
    print,
    project,
    fsPath,
  });

  print("\n✅ The 'dev' branch has been successfully imported !\n");

  return {
    devImportBranch,
    tempBranch,
    tempRemote,
  };
}

async function _inquirerDefineGitBranchName({
  project,
}: {
  project: Project;
}): Promise<string> {
  const inquirerName = "define-git-branch-name";
  return inquirer
    .prompt([
      {
        type: "input",
        name: inquirerName,
        message:
          "What name would you like to give to the branch where dev will be imported ?",
        default: `migration-to-monorepo-${project}-dev`,
      },
    ])
    .then((answers) => answers[inquirerName])
    .catch(_handleError);
}

async function _processProjectImport({
  baseBranch,
  branchName,
  fsPath,
  print,
  project,
}: {
  baseBranch: string;
  branchName: string;
  fsPath: string;
  print: PrintFn;
  project: Project;
}) {
  const monorepoBasePath = await getMonorepoBasePath();
  const projectSubpath = MAP_PROJECT_TO_MONOREPO_FOLDER[project];
  print(
    `\n¤ Checkout to ${baseBranch} to rebase before creating the new branch.`,
  );
  const currentGitBranch = await _getCurrentGitBranch();
  if (currentGitBranch !== baseBranch) {
    await exec(`git checkout ${baseBranch}`, { cwd: monorepoBasePath });
  }

  if (baseBranch === "main" || baseBranch === "dev") {
    print("¤ Rebase from remote");
    await exec("git pull origin --rebase", { cwd: monorepoBasePath });
  }

  print(`¤ Create the branch where to import ${project}:dev : ${branchName}`);
  const cmdCreateBranch = `git checkout -b ${branchName}`;
  print(`> ${cmdCreateBranch}`);
  await exec(cmdCreateBranch, { cwd: monorepoBasePath });

  print("¤ Trigger the project import script");
  const tempBranch = "temp/prepare-migration";
  const tempRemote = `${project}-remote`;
  const cmdImportProject = `npx ts-node tools/toolkit-cli/src/index.ts project:import ${projectSubpath} ${fsPath} \
  --branch dev --noCleanUp --tempBranch ${tempBranch} --tempRemote ${tempRemote}`;
  print(`> ${cmdImportProject}`);
  const { stdout } = await exec(cmdImportProject, { cwd: monorepoBasePath });
  print(stdout);

  return {
    tempBranch,
    tempRemote,
  };
}

async function importOpenBranches({
  baseBranch,
  devImportBranch,
  fsPath,
  print,
  project,
  tempBranch,
  tempRemote,
}: {
  baseBranch: string;
  devImportBranch: string;
  fsPath: string;
  print: PrintFn;
  project: Project;
  tempBranch: string;
  tempRemote: string;
}) {
  const shouldImportOpenBranches = await _inquirerShouldImportOpenBranches({
    project,
  });

  if (shouldImportOpenBranches) {
    const openMRBranches = await _processListOpenBranches({
      fsPath,
      print,
      project,
    });

    const selectedBranches = await _inquirerSelectOpenBranchesToImport({
      branches: openMRBranches,
    });

    const importedBranches = await _processImportOpenBranches({
      baseBranch,
      branches: selectedBranches,
      devImportBranch,
      fsPath,
      print,
      project,
      tempBranch,
      tempRemote,
    });

    const shouldRemoveLocalOpenBranches =
      await _inquirerShouldRemoveLocalOpenBranches();
    if (shouldRemoveLocalOpenBranches) {
      await _processRemoveLocalOpenBranches({
        branches: importedBranches,
        print,
      });
    }

    print("✅ All open branches has been imported and pushed to monorepo !\n");
  }
}

async function _inquirerShouldImportOpenBranches({
  project,
}: {
  project: Project;
}): Promise<boolean> {
  const inquirerNameWhetherImport = "confirm-import-branches";
  return inquirer
    .prompt([
      {
        type: "confirm",
        name: inquirerNameWhetherImport,
        message: `Would you like to import open branches from ${project} ?`,
      },
      {
        type: "confirm",
        name: "confirm-have-gitlab-token",
        message: `To proceed to the import, you need to export a bash variable : GITLAB_PRIVATE_TOKEN. Create a Personal Access Token on Gitlab if not set yet.`,
        when(answers) {
          return answers[inquirerNameWhetherImport];
        },
      },
    ])
    .then((answers) => answers[inquirerNameWhetherImport])
    .catch(_handleError);
}

async function _processListOpenBranches({
  fsPath,
  print,
  project,
}: {
  fsPath: string;
  print: PrintFn;
  project: Project;
}) {
  print("\n¤ Retrieving the list of open branches ...");

  // Define script inputs
  const remote = "origin";
  const gitlabToken = (await exec("echo $GITLAB_PRIVATE_TOKEN")).stdout.trim();

  // Check token validity
  const { stdout } = await exec(
    `curl --header "PRIVATE-TOKEN: ${gitlabToken}" "https://gitlab.com/api/v4/version"`,
  );
  if (!stdout.includes("version")) {
    throw new Error("❌ Gitlab Token is not valid !");
  }

  // Retrieve recent branches
  const recentBranches = await getBranchesCreatedInLastXMonths({
    print,
    remote,
    initialRepoAbsolutePath: fsPath,
    monthAgeMax: "4",
  });

  // Retrieve branches related to open merge request
  const openMRBranches = await getBranchesRelatedToOpenMR({
    print,
    remote,
    gitlabToken,
    branches: recentBranches,
    projectId: MAP_PROJECT_TO_ID[project],
  });

  print("");

  return openMRBranches;
}

async function _inquirerSelectOpenBranchesToImport({
  branches,
}: {
  branches: string[];
}): Promise<string[]> {
  const inquirerName = "select-open-branches-to-import";
  return inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Select the branches you would like to import.",
        name: inquirerName,
        choices: branches.map((branchName) => {
          return {
            name: branchName,
          };
        }),
      },
    ])
    .then((answers) => {
      return answers[inquirerName];
    })
    .catch(_handleError);
}

async function _processImportOpenBranches({
  baseBranch,
  branches,
  devImportBranch,
  fsPath,
  print,
  project,
  tempBranch,
  tempRemote,
}: {
  baseBranch: string;
  branches: string[];
  devImportBranch: string;
  fsPath: string;
  print: PrintFn;
  project: Project;
  tempBranch: string;
  tempRemote: string;
}): Promise<string[]> {
  print("\n¤ Start importing the selected branches ...");

  const monorepoBasePath = await getMonorepoBasePath();
  const initialRepoAbsolutePath = path.resolve(process.cwd(), fsPath);

  // Sync local with origin
  await exec("git fetch origin", { cwd: initialRepoAbsolutePath });

  // Checkout to the main branch to start from clean branch
  await _switchBranch({
    branchName: baseBranch,
    repoBasePath: monorepoBasePath,
  });

  // Make local git more aware of renaming files
  await exec("git config --global diff.renames true");
  await exec("git config --global merge.renames true");

  const importedBranches: Array<string> = [];
  for (const initialBranch of branches) {
    const projectQuickname = project.split("-").pop();
    const monorepoBranch = `migration-${projectQuickname}-${initialBranch}`;
    try {
      let errorMessage = "";

      print(`\n-> Start importing ${initialBranch}`);

      errorMessage = await _prepareInitialRepository({
        initialBranch,
        initialRepoAbsolutePath,
        print,
        project,
        tempBranch,
      });

      if (!errorMessage) {
        print(`-> Create ${monorepoBranch} in monorepository`);
        await _createBranchToImportOpenBranch({
          branchName: monorepoBranch,
          monorepoBasePath: monorepoBasePath,
        });
        importedBranches.push(monorepoBranch);
      }

      if (!errorMessage) {
        await _processImportOpenBranch({
          branchName: monorepoBranch,
          devImportBranch,
          initialBranch,
          monorepoBasePath,
          print,
          tempRemote,
        });
      }

      if (errorMessage) {
        print(errorMessage);
      } else {
        print(`✅ Imported ${initialBranch} into ${monorepoBranch} !`);
      }
    } catch (error) {
      print(`❌ Something went wrong !`);
      console.error(error);
    }

    // Checkout back to the base branch
    const currentGitBranch = await _getCurrentGitBranch();
    if (currentGitBranch !== baseBranch) {
      await exec(`git checkout ${baseBranch}`, { cwd: monorepoBasePath });
    }
  }

  print("\n✅ All selected branches have been imported !\n");

  return importedBranches;
}

async function _prepareInitialRepository({
  initialBranch,
  initialRepoAbsolutePath,
  print,
  project,
  tempBranch,
}: {
  initialBranch: string;
  initialRepoAbsolutePath: string;
  print: PrintFn;
  project: Project;
  tempBranch: string;
}) {
  let errorMessage = "";

  // Switch to the branch to import
  await _switchBranch({
    branchName: initialBranch,
    repoBasePath: initialRepoAbsolutePath,
  });

  // Pull the latest version
  await exec(`git pull --quiet origin ${initialBranch} --rebase`, {
    cwd: initialRepoAbsolutePath,
  });

  // Check that the branch has been rebased on project dev branch
  print("-> Rebase the initial branch on dev");
  errorMessage = await _rebaseInitialOnDev({
    initialRepoAbsolutePath,
    initialBranch,
    project,
  });

  // Rebase to the temp branch containing the "moving files" commit
  if (!errorMessage) {
    print(`-> Rebase the initial branch on ${tempBranch}`);
    errorMessage = await _rebaseInitialOnTempBranchWithMovingCommit({
      initialBranch,
      initialRepoAbsolutePath,
      project,
      tempBranch,
    });
  }

  return errorMessage;
}

async function _rebaseInitialOnDev({
  initialBranch,
  initialRepoAbsolutePath,
  project,
}: {
  initialBranch: string;
  initialRepoAbsolutePath: string;
  project: Project;
}) {
  // Make sure the initial branch is up to date with dev without conflicts
  try {
    await exec(`git rebase dev`, { cwd: initialRepoAbsolutePath });
  } catch (_error) {
    await exec("git rebase --abort", { cwd: initialRepoAbsolutePath });
    return `❌ Could not rebase ${initialBranch} on ${project}/dev`;
  }
}

async function _rebaseInitialOnTempBranchWithMovingCommit({
  initialBranch,
  initialRepoAbsolutePath,
  project,
  tempBranch,
}: {
  initialBranch: string;
  initialRepoAbsolutePath: string;
  project: Project;
  tempBranch: string;
}) {
  try {
    await exec(`git rebase ${tempBranch}`, { cwd: initialRepoAbsolutePath });
  } catch (_error) {
    // Can happen if new files have been created in the open branch
    await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm-conflicts-resolved",
        message:
          "Some conflicts have been detected during the rebase.\nPlease solve them locally and complete the rebase before continuing.",
      },
    ]);
    try {
      // Check a last time that the rebase have been finished
      await exec(`git rebase ${tempBranch}`, { cwd: initialRepoAbsolutePath });
    } catch (_err) {
      await exec("git rebase --abort", { cwd: initialRepoAbsolutePath });
      return `❌ Could not rebase ${initialBranch} on ${tempBranch} containing moving commit`;
    }
    try {
      // If any files are detected out of apps/..., should move them
      const projectSubpath = MAP_PROJECT_TO_MONOREPO_FOLDER[project];
      const filesToFilterOut = [".git", "apps"];
      const files = fs
        .readdirSync(initialRepoAbsolutePath)
        .filter((f) => !filesToFilterOut.includes(f));
      files.forEach((file) => {
        const sourcePath = path.resolve(initialRepoAbsolutePath, file);
        const targetPath = path.resolve(
          initialRepoAbsolutePath,
          projectSubpath,
          file,
        );
        fs.moveSync(sourcePath, targetPath, { overwrite: true });
      });
      await exec(
        "git add -A && git commit -m 'fix(migration): Move new files in monorepo data structure'",
        { cwd: initialRepoAbsolutePath },
      );
    } catch (_err) {
      // Nothing to commit, continue
    }
  }
}

async function _createBranchToImportOpenBranch({
  branchName,
  monorepoBasePath,
}: {
  branchName: string;
  monorepoBasePath: string;
}) {
  const branchAlreadyExists =
    (
      await exec(`git branch | grep ${branchName} | wc -l`, {
        cwd: monorepoBasePath,
      })
    ).stdout.trim() !== "0";
  if (branchAlreadyExists) {
    // Delete it to create a new and clean one
    await exec(`git branch -D ${branchName}`, {
      cwd: monorepoBasePath,
    });
  }
  await exec(`git checkout -b ${branchName}`, {
    cwd: monorepoBasePath,
  });
}

async function _processImportOpenBranch({
  branchName,
  devImportBranch,
  initialBranch,
  monorepoBasePath,
  print,
  tempRemote,
}: {
  branchName: string;
  devImportBranch: string;
  initialBranch: string;
  monorepoBasePath: string;
  print: PrintFn;
  tempRemote: string;
}) {
  let errorMessage = "";

  // Fetch updates from the remote pointing to local project
  await exec(`git fetch ${tempRemote}`, { cwd: monorepoBasePath });

  // Merge remote project git history into monorepository history
  const remoteBranch = `${tempRemote}/${initialBranch}`;
  print(`-> Import commits from ${remoteBranch}`);
  errorMessage = await _mergeInitialGitHistoryInMonorepo({
    remoteBranch,
    monorepoBasePath,
  });

  // Rebase on the branch that imports dev to share the same merge history
  if (!errorMessage) {
    print(`-> Rebase on ${devImportBranch}`);
    errorMessage = await _rebaseImportBranchOnDevImportBranch({
      branchName,
      devImportBranch,
      monorepoBasePath,
    });
  }

  if (!errorMessage) {
    print(`-> Push ${branchName} to Gitlab`);
    await exec(`git push --set-upstream origin ${branchName}`, {
      cwd: monorepoBasePath,
    });
  }
  return errorMessage;
}

async function _mergeInitialGitHistoryInMonorepo({
  monorepoBasePath,
  remoteBranch,
}: {
  monorepoBasePath: string;
  remoteBranch: string;
}) {
  try {
    await exec(
      `export ECOSYSTEM_SKIP_HOOKS=true; git merge -m "temp merge commit" ${remoteBranch} --allow-unrelated-histories`,
      { cwd: monorepoBasePath },
    );
  } catch (_error) {
    return `❌ Could not merge git history from ${remoteBranch} in monorepo`;
  }
}

async function _rebaseImportBranchOnDevImportBranch({
  branchName,
  devImportBranch,
  monorepoBasePath,
}: {
  branchName: string;
  devImportBranch: string;
  monorepoBasePath: string;
}) {
  try {
    await exec(`git rebase ${devImportBranch}`, { cwd: monorepoBasePath });
  } catch (_error) {
    await exec("git rebase --abort", { cwd: monorepoBasePath });
    return `❌ Could not rebase ${branchName} on ${devImportBranch}`;
  }
}

async function _inquirerShouldRemoveLocalOpenBranches(): Promise<boolean> {
  const inquirerName = "confirm-remove-local-open-branches";
  return inquirer
    .prompt([
      {
        type: "confirm",
        message:
          "Would you like to remove local branches as they are now stored upstream on Gitlab ?",
        name: inquirerName,
      },
    ])
    .then((answers) => answers[inquirerName])
    .catch(_handleError);
}

async function _processRemoveLocalOpenBranches({
  print,
  branches,
}: {
  print: PrintFn;
  branches: string[];
}) {
  print("\n¤ Start removing locally the imported open branches");
  const monorepoBasePath = await getMonorepoBasePath();
  for (const branch of branches) {
    await exec(`git branch -D ${branch}`, { cwd: monorepoBasePath });
    print(`✔ Successfully removed ${branch} !`);
  }
}

async function cleanDevProject({
  devImportBranch,
  print,
  project,
}: {
  devImportBranch: string;
  print: PrintFn;
  project: Project;
}) {
  const shouldCleanProject = await _inquirerShouldCleanProject({
    devImportBranch,
    project,
  });

  if (shouldCleanProject) {
    await _checkoutToDevImportBranch({ devImportBranch, print });

    if (project === "bsport-saas") {
      await _inquirerAskManualFixForScss({ project });
    }

    await _processCleanProject({
      devImportBranch,
      print,
      project,
    });
  }

  await _processPushDevUpstream({ devImportBranch, print });

  print("\n✅ Successfully pushed a cleaned branch to Gitlab !\n");
}

async function _inquirerShouldCleanProject({
  devImportBranch,
  project,
}: {
  devImportBranch: string;
  project: Project;
}) {
  const inquirerName = "confirm-clean-project";
  return inquirer
    .prompt([
      {
        type: "confirm",
        name: inquirerName,
        message: `Would you like to clean the import of ${project} in ${devImportBranch} ?`,
      },
    ])
    .then((answers) => answers[inquirerName])
    .catch(_handleError);
}

async function _checkoutToDevImportBranch({
  devImportBranch,
  print,
}: {
  devImportBranch: string;
  print: PrintFn;
}) {
  print(`\n¤ Checkout to ${devImportBranch} to clean the branch`);
  const monorepoBasePath = await getMonorepoBasePath();
  const cmdGitCheckout = `git checkout ${devImportBranch}`;
  print(`> ${cmdGitCheckout}\n`);
  const currentGitBranch = await _getCurrentGitBranch();
  if (currentGitBranch !== devImportBranch) {
    try {
      await exec(cmdGitCheckout, { cwd: monorepoBasePath });
    } catch (_error) {
      // Expect error due to automatic husky scripts that basically failed in monorepo
    }
  }
}

async function _inquirerAskManualFixForScss({ project }: { project: Project }) {
  const inquirerName = "confirm-manual-fix-scss";
  const projectSubpath = MAP_PROJECT_TO_MONOREPO_FOLDER[project];
  const brokenFilePath = `${projectSubpath}/src/libs/private-service/components`;
  const fixScssPromptDirective = `Before continuing, fix the scss bug in ${brokenFilePath} as shown after.`;
  const fixScssPromptCode = `
// Before
.fc-toolbar {
  .fc-center h2 {
    font-size: 1.25em;
  }
  display: block;
  text-align: center;
  @media (min-width: 600px) {
    display: flex;
  }
}

// After
.fc-toolbar {
  .fc-center h2 {
    font-size: 1.25em;
  }
  & {
    display: block;
    text-align: center;
  }
  @media (min-width: 600px) {
    display: flex;
  }
}
`;
  const fixScssPromptConfirm =
    "Confirm when the fix is done. You don't need to commit changes.";

  return inquirer
    .prompt([
      {
        name: inquirerName,
        message: `${fixScssPromptDirective}\n${fixScssPromptCode}\n${fixScssPromptConfirm}`,
        type: "confirm",
      },
    ])
    .catch(_handleError);
}

async function _processCleanProject({
  devImportBranch,
  print,
  project,
}: {
  devImportBranch;
  print: PrintFn;
  project: Project;
}) {
  print(`\n¤ Start cleaning ${devImportBranch}`);

  const monorepoBasePath = await getMonorepoBasePath();
  const projectSubpath = MAP_PROJECT_TO_MONOREPO_FOLDER[project];

  const cmdCleanProject = `npx ts-node tools/toolkit-cli/src/index.ts project:clean ${projectSubpath} --repo ${project}`;
  print(`> ${cmdCleanProject}`);
  await exec(cmdCleanProject, { cwd: monorepoBasePath });

  print("\n¤ Cleaning finished with success");
}

async function _processPushDevUpstream({
  devImportBranch,
  print,
}: {
  devImportBranch: string;
  print: PrintFn;
}) {
  print(`¤ Push ${devImportBranch} to monorepo upstream`);

  const monorepoBasePath = await getMonorepoBasePath();

  const currentGitBranch = await _getCurrentGitBranch();
  if (currentGitBranch !== devImportBranch) {
    await exec(`git checkout ${devImportBranch}`, { cwd: monorepoBasePath });
  }

  const { stdout } = await exec(
    `git push --set-upstream origin ${devImportBranch}`,
    {
      cwd: monorepoBasePath,
    },
  );
  print(`¤ ${stdout.trim()}\n`);
}

export default function legacyMigrate(program: Command) {
  program
    .command("legacy:migrate")
    .description(
      "An interactive CLI to import legacy bsport projects : bsport-saas, bsport-widget",
    )
    .option(
      "-q, --quiet",
      "suppress all output, unless an error occurs.",
      false,
    )
    .option(
      "-b, --base-branch <string>",
      "The monorepository branch to use as base to create the new branches",
      "main",
    )
    .action(action);
  return program;
}
