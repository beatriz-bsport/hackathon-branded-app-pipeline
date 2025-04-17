import child_process from "child_process";
import type { Command } from "commander";
import fs from "fs-extra";
import util from "node:util";
import path from "path";

const exec = util.promisify(child_process.exec);

type PrintFn = (...msg: string[]) => void;

const GITLAB_PROJECTS = ["bsport-saas", "bsport-widget"] as const;

type GitlabProject = (typeof GITLAB_PROJECTS)[number];

export const MAP_PROJECT_TO_ID: Record<GitlabProject, string> = {
  "bsport-saas": "6481110",
  "bsport-widget": "13436740",
};

function getPrintFns({ quiet }: { quiet: boolean }) {
  return {
    print: (...msgs) => !quiet && console.log(...msgs),
    printGroup: (...msgs) => !quiet && console.group(...msgs),
    printGroupEnd: () => !quiet && console.groupEnd(),
  };
}

async function action(
  initialRepositoryPath: string,
  {
    gitlabProject,
    gitlabId,
    quiet,
    month,
  }: {
    gitlabProject: GitlabProject;
    gitlabId: string;
    quiet: boolean;
    month: string;
  },
) {
  const { print, printGroup, printGroupEnd } = getPrintFns({ quiet });

  printGroup("\n\t🚀    Start listing open branches    🚀");

  const remote = "origin";
  const initialRepoAbsolutePath = path.resolve(
    process.cwd(),
    initialRepositoryPath,
  );

  printGroup("\n1️⃣  Check inputs are valid");
  await checkInputsAreValid({
    print,
    initialRepoAbsolutePath,
    gitlabProject,
    gitlabId,
  });
  printGroupEnd();

  printGroup("\n2️⃣  Check whether a valid Gitlab token API is provided");
  const gitlabToken = await checkGitlabTokenValidity({ print });
  printGroupEnd();

  printGroup(`\n3️⃣  Retrieve branches created during the last ${month} months`);
  const recentBranches = await getBranchesCreatedInLastXMonths({
    print,
    initialRepoAbsolutePath,
    remote,
    monthAgeMax: month,
  });
  printGroupEnd();

  printGroup("\n4️⃣  Select branches related to an open merge request");
  const openMRBranches = await getBranchesRelatedToOpenMR({
    print,
    remote,
    gitlabToken,
    branches: recentBranches,
    projectId: gitlabId || MAP_PROJECT_TO_ID[gitlabProject],
  });
  openMRBranches.forEach((branch) => {
    print("-> : ", branch);
  });
  printGroupEnd();

  print(`\n✅ Successfully list open branches !`);

  printGroupEnd();
}

async function checkInputsAreValid({
  print,
  initialRepoAbsolutePath,
  gitlabProject,
  gitlabId,
}: {
  print: PrintFn;
  initialRepoAbsolutePath: string;
  gitlabProject: GitlabProject;
  gitlabId: string;
}) {
  print("¤ Check whether the initial repository is a Git repository");
  if (!fs.existsSync(initialRepoAbsolutePath)) {
    throw new Error(
      `❌ Unresolved path "${initialRepoAbsolutePath}", please provide a valid initial path`,
    );
  }
  const isGitRepository =
    (
      await exec("git rev-parse --is-inside-work-tree", {
        cwd: initialRepoAbsolutePath,
      })
    ).stdout === "true\n";
  if (!isGitRepository) {
    throw new Error(
      `❌ Invalid path: ${initialRepoAbsolutePath} is not a valid git repository`,
    );
  }

  print(
    `¤ Check whether gitlab-project input is valid : ${GITLAB_PROJECTS.join(", ")}`,
  );
  if (!gitlabId && !GITLAB_PROJECTS.includes(gitlabProject)) {
    print("! The project name or id is invalid !");
    throw new Error(
      `❌ The 'gitlab-project' input is invalid : ${gitlabProject}!`,
    );
  }

  print("¤ All inputs are good !");
}

async function checkGitlabTokenValidity({ print }: { print: PrintFn }) {
  print(
    "¤ Retrieve your Gitlab API token from the env variable : GITLAB_PRIVATE_TOKEN.",
  );
  print("> echo $GITLAB_PRIVATE_TOKEN");
  const gitlabToken = (await exec("echo $GITLAB_PRIVATE_TOKEN")).stdout.trim();

  print("¤ Check validity of this token.");
  print(
    '> curl --header --silent "PRIVATE-TOKEN: <your-private-token>" "https://gitlab.com/api/v4/version"',
  );
  const { stdout } = await exec(
    `curl --header "PRIVATE-TOKEN: ${gitlabToken}" "https://gitlab.com/api/v4/version"`,
  );
  if (!stdout.includes("version")) {
    print(
      "! Your token is not valid. Either it has expired or the GITLAB_PRIVATE_TOKEN env is not exported.",
    );
    print(
      "! Please retrieve a valid token on Gitlab : https://gitlab.com/-/user_settings/personal_access_tokens",
    );
    throw new Error("❌ Gitlab Token is not valid !");
  }

  print("¤ Token is valid !");
  return gitlabToken;
}

export async function getBranchesCreatedInLastXMonths({
  print,
  remote,
  initialRepoAbsolutePath,
  monthAgeMax,
}: {
  print: PrintFn;
  remote: string;
  initialRepoAbsolutePath: string;
  monthAgeMax: string;
}): Promise<string[]> {
  const X_MONTHS_AGO = new Date();
  X_MONTHS_AGO.setMonth(X_MONTHS_AGO.getMonth() - parseInt(monthAgeMax));

  print("¤ Fetch all branches in initial repository");
  print("> git fetch --quiet --all");
  await exec("git fetch --quiet --all", { cwd: initialRepoAbsolutePath });

  print("¤ For each branch, retrieve the first commit date");
  const { stdout } = await exec(
    `git for-each-ref --sort=authordate --format='%(refname:short) %(authordate:iso8601)' refs/remotes/${remote}`,
    { cwd: initialRepoAbsolutePath },
  );
  const lines = stdout.trim().split("\n");

  print(
    `¤ Keep the branches for which first commit is more recent than ${X_MONTHS_AGO}`,
  );
  const recentBranches: string[] = [];
  for (const line of lines) {
    const [branch, ...dateParts] = line.split(" ");
    const date = new Date(dateParts.join(" "));
    if (date >= X_MONTHS_AGO) {
      recentBranches.push(branch);
    }
  }

  print(`¤ Number of selected branches : ${recentBranches.length}`);
  return recentBranches;
}

export async function getBranchesRelatedToOpenMR({
  print,
  remote,
  branches,
  gitlabToken,
  projectId,
}: {
  print: PrintFn;
  remote: string;
  branches: string[];
  gitlabToken: string;
  projectId: string;
}) {
  const matchingBranches: string[] = [];

  for (const branch of branches) {
    const shortBranch = branch.replace(`${remote}/`, "");
    if (
      await _checkOpenMergeRequests({
        projectId,
        branch: shortBranch,
        gitlabToken,
      })
    ) {
      matchingBranches.push(branch.replace(`${remote}/`, ""));
    }
  }
  print(
    `¤ Found ${matchingBranches.length} matching branches related to an open merge request`,
  );
  return matchingBranches.sort((a, b) => a.localeCompare(b));
}

async function _checkOpenMergeRequests({
  projectId,
  branch,
  gitlabToken,
}: {
  projectId: string;
  branch: string;
  gitlabToken: string;
}): Promise<boolean> {
  const gitlabUrl = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests?state=opened&source_branch=`;
  const { stdout } = await exec(
    `curl --silent --header "PRIVATE-TOKEN: ${gitlabToken}" "${gitlabUrl}${branch}"`,
  );
  const response = JSON.parse(stdout);
  return response.length > 0;
}

export default function openBranchList(program: Command) {
  program
    .command("open:branch:list")
    .description(
      "List open branches of a gitlab repo which have been created less than X months ago",
    )
    .argument(
      "<initial-repository-path>",
      "Filesystem path where the target repository is locally located",
    )
    .option(
      "-gp, --gitlab-project <string>",
      `Name of the Gitlab Repository. Valid inputs : ${GITLAB_PROJECTS.join(", ")}`,
      undefined,
    )
    .option(
      "-gi, --gitlab-id <string>",
      "If you don't provide a gitlabProject, you must provide a valid gitlab project Id",
      undefined,
    )
    .option(
      "-m, --month <string>",
      "The script will keep only branches created less than $month ago.",
      "4",
    )
    .option(
      "-q, --quiet",
      "suppress all output, unless an error occurs.",
      false,
    )
    .action(action);
  return program;
}
